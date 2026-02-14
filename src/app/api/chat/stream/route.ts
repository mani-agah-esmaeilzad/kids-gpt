import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { safetyClassify, buildRefusalMessage } from "@/lib/safety";
import { createChatCompletion, streamText } from "@/lib/avalai";
import { getAgeSystemPrompt } from "@/lib/policy";
import { checkQuotas } from "@/lib/quotas";
import { rateLimit, acquireConcurrencySlot } from "@/lib/rate-limit";
import { logEvent } from "@/lib/logger";
import { resolveRateLimits } from "@/lib/rate-policy";
import { getModelPricing, estimateTokenCostToman } from "@/lib/model-pricing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const sseHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  };
  const body = await request.json().catch(() => null);
  if (!body?.message) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const cookieStore = cookies();
  const kidCookie = cookieStore.get("gptkids_kid")?.value;
  const deviceId = cookieStore.get("gptkids_device")?.value;
  if (!kidCookie || !deviceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kidSession = await prisma.kidDeviceSession.findUnique({
    where: { deviceId }
  });
  if (!kidSession?.activeChildId) {
    return NextResponse.json({ error: "No active profile" }, { status: 401 });
  }
  await prisma.kidDeviceSession.update({
    where: { deviceId },
    data: { lastSeenAt: new Date() }
  });

  const child = await prisma.childProfile.findUnique({
    where: { id: kidSession.activeChildId },
    include: { parent: { include: { user: true } } }
  });
  if (!child) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 });
  }

  const subscription = await prisma.subscription.findFirst({
    where: { parentId: child.parentId, status: "ACTIVE" },
    include: { plan: true }
  });
  if (!subscription) {
    const refusal = "برای ادامه، از والدینت بخواه اشتراک را فعال کنند.";
    await logEvent("chat.no_subscription", {
      requestId,
      userId: child.parent.userId,
      childId: child.id
    });
    return new Response(streamText(refusal), { headers: sseHeaders });
  }

  const quotas = subscription.plan.quotasJson as any;
  const ratePolicy = await resolveRateLimits(child.parentId, quotas ?? {});
  if (ratePolicy.isBanned) {
    const refusal = "فعلا امکان گفت‌وگو فعال نیست. لطفا از والدینت بخواه بررسی کنند.";
    await logEvent("chat.banned", {
      requestId,
      userId: child.parent.userId,
      childId: child.id
    }, "WARN");
    return new Response(streamText(refusal), { headers: sseHeaders });
  }

  const parentRate = await rateLimit(`parent:${child.parentId}`, ratePolicy.parentRPM, 60);
  if (!parentRate.allowed) {
    const refusal = "کمی استراحت کنیم و بعد دوباره پیام بدهیم.";
    await logEvent("chat.parent_rate_limit", {
      requestId,
      userId: child.parent.userId,
      childId: child.id,
      remaining: parentRate.remaining
    }, "WARN");
    return new Response(streamText(refusal), { headers: sseHeaders });
  }

  const rate = await rateLimit(`child:${child.id}`, ratePolicy.childRPM, 60);
  if (!rate.allowed) {
    const refusal = "کمی استراحت کنیم و بعد دوباره پیام بدهیم.";
    await logEvent("chat.rate_limit", {
      requestId,
      userId: child.parent.userId,
      childId: child.id,
      remaining: rate.remaining
    }, "WARN");
    return new Response(streamText(refusal), { headers: sseHeaders });
  }

  const concurrency = await acquireConcurrencySlot(`child:${child.id}:conc`, ratePolicy.childConcurrency, 20);
  if (!concurrency.allowed) {
    const refusal = "الان کمی شلوغ است. لطفا چند لحظه بعد دوباره امتحان کن.";
    await logEvent("chat.concurrent_limit", {
      requestId,
      userId: child.parent.userId,
      childId: child.id
    }, "WARN");
    return new Response(streamText(refusal), { headers: sseHeaders });
  }

  const quota = await checkQuotas(child.parentId, child.id);
  if (quota.warnings?.length) {
    await logEvent("chat.quota_warning", {
      requestId,
      userId: child.parent.userId,
      childId: child.id,
      warnings: quota.warnings
    });
  }
  if (!quota.allowed) {
    const refusal =
      "امروز به سقف مجاز رسیدیم. لطفا از والدینت بخواه اگر لازم بود پلن را ارتقا دهند.";
    await logEvent("chat.quota_block", {
      requestId,
      userId: child.parent.userId,
      childId: child.id,
      reason: quota.reason
    }, "WARN");
    return new Response(streamText(refusal), { headers: sseHeaders });
  }

  const settings = (child.settings as any) ?? {};
  const now = new Date();
  if (settings?.allowedHours?.start && settings?.allowedHours?.end) {
    const [startH, startM] = settings.allowedHours.start.split(":");
    const [endH, endM] = settings.allowedHours.end.split(":");
    const start = new Date(now);
    const end = new Date(now);
    start.setHours(Number(startH), Number(startM), 0, 0);
    end.setHours(Number(endH), Number(endM), 0, 0);
    if (now < start || now > end) {
      const refusal = "الان زمان گفتگو نیست. لطفا در ساعات مجاز دوباره امتحان کن.";
      logEvent("chat.outside_hours", { childId: child.id });
      return new Response(streamText(refusal), { headers: sseHeaders });
    }
  }

  const whitelist: string[] = settings?.topicWhitelist ?? [];
  const blacklist: string[] = settings?.topicBlacklist ?? [];
  const lower = String(body.message).toLowerCase();
  if (blacklist.some((item) => item && lower.includes(item.toLowerCase()))) {
    const refusal = "این موضوع در حال حاضر مجاز نیست. بیا درباره چیزهای امن صحبت کنیم.";
    await logEvent("chat.topic_block", {
      requestId,
      userId: child.parent.userId,
      childId: child.id,
      type: "blacklist"
    }, "WARN");
    return new Response(streamText(refusal), { headers: sseHeaders });
  }
  if (whitelist.length > 0 && !whitelist.some((item) => item && lower.includes(item.toLowerCase()))) {
    const refusal = "این موضوع خارج از موضوعات مجاز است. بیا از لیست موضوعات مورد تایید انتخاب کنیم.";
    await logEvent("chat.topic_block", {
      requestId,
      userId: child.parent.userId,
      childId: child.id,
      type: "whitelist"
    }, "WARN");
    return new Response(streamText(refusal), { headers: sseHeaders });
  }

  let conversation = body.conversationId
    ? await prisma.conversation.findUnique({ where: { id: body.conversationId } })
    : null;
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { childId: child.id, title: body.message.slice(0, 48) }
    });
  }

  const userMessage = await prisma.message.create({
    data: {
      conversationId: conversation!.id,
      role: "USER",
      content: body.message,
      tokens: 0
    }
  });

  const history = await prisma.message.findMany({
    where: { conversationId: conversation!.id, blocked: false },
    orderBy: { createdAt: "asc" },
    take: 12
  });

  const preCheck = await safetyClassify(body.message);
  if (preCheck.action !== "ALLOW") {
    const refusal = buildRefusalMessage(preCheck.action, preCheck.type);
    await logEvent("chat.precheck_block", {
      requestId,
      userId: child.parent.userId,
      childId: child.id,
      type: preCheck.type
    }, "WARN");
    await prisma.message.create({
      data: {
        conversationId: conversation!.id,
        role: "ASSISTANT",
        content: refusal,
        blocked: true
      }
    });
    await prisma.safetyIncident.create({
      data: {
        parentId: child.parentId,
        childId: child.id,
        conversationId: conversation!.id,
        messageId: userMessage.id,
        type: preCheck.type,
        severity: preCheck.action === "ESCALATE" ? 3 : 2,
        direction: "INBOUND",
        contentExcerpt: body.message.slice(0, 120),
        action: preCheck.action
      }
    });
    return new Response(streamText(refusal, { conversationId: conversation!.id }), {
      headers: sseHeaders
    });
  }

  const systemPrompt = await getAgeSystemPrompt(child.ageGroup);
  const startedAt = Date.now();
  const completion = await createChatCompletion([
    { role: "system", content: systemPrompt },
    ...history.map((message) => ({
      role: (message.role === "USER" ? "user" : "assistant") as "user" | "assistant",
      content: message.content
    }))
  ]);
  const latencyMs = Date.now() - startedAt;

  let finalContent = completion.content;
  const postCheck = await safetyClassify(finalContent);
  if (postCheck.action !== "ALLOW") {
    finalContent = buildRefusalMessage(postCheck.action, postCheck.type);
    await logEvent("chat.postcheck_block", {
      requestId,
      userId: child.parent.userId,
      childId: child.id,
      type: postCheck.type
    }, "WARN");
    await prisma.safetyIncident.create({
      data: {
        parentId: child.parentId,
        childId: child.id,
        conversationId: conversation!.id,
        messageId: userMessage.id,
        type: postCheck.type,
        severity: postCheck.action === "ESCALATE" ? 3 : 2,
        direction: "OUTBOUND",
        contentExcerpt: completion.content.slice(0, 120),
        action: postCheck.action
      }
    });
  }

  const assistantMessage = await prisma.message.create({
    data: {
      conversationId: conversation!.id,
      role: "ASSISTANT",
      content: finalContent,
      tokens: completion.usage?.total_tokens ?? 0,
      blocked: postCheck.action !== "ALLOW"
    }
  });

  const inputTokens = completion.usage?.prompt_tokens ?? 0;
  const outputTokens = completion.usage?.completion_tokens ?? 0;
  const totalTokens = completion.usage?.total_tokens ?? inputTokens + outputTokens;
  const pricing = await getModelPricing(completion.raw?.model ?? "");
  const estimatedTokenCostToman = estimateTokenCostToman(pricing, inputTokens, outputTokens);

  await prisma.usageLedger.create({
    data: {
      userId: child.parent.userId,
      parentId: child.parentId,
      childId: child.id,
      messagesCount: 1,
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedTokenCostToman,
      modelUsed: completion.raw?.model ?? "",
      outcome: postCheck.action,
      latencyMs
    }
  });
  await logEvent("chat.complete", {
    requestId,
    userId: child.parent.userId,
    childId: child.id,
    tokens: totalTokens,
    cost: estimatedTokenCostToman,
    latencyMs
  });

  const stream = streamText(finalContent, {
    conversationId: conversation!.id,
    messageId: assistantMessage.id
  });
  const response = new Response(stream, { headers: sseHeaders });
  response.headers.set("x-conversation-id", conversation!.id);
  response.headers.set("x-message-id", assistantMessage.id);
  return response;
}
