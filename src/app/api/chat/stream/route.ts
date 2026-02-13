import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { safetyClassify, buildRefusalMessage } from "@/lib/safety";
import { createChatCompletion, streamText } from "@/lib/avalai";
import { getAgeSystemPrompt } from "@/lib/policy";
import { checkQuotas } from "@/lib/quotas";
import { rateLimit } from "@/lib/rate-limit";
import { logEvent } from "@/lib/logger";

export async function POST(request: Request) {
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
    include: { parent: true }
  });
  if (!child) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 });
  }

  const rate = await rateLimit(`child:${child.id}`, 12, 60);
  if (!rate.allowed) {
    const refusal = "کمی استراحت کنیم و بعد دوباره پیام بدهیم.";
    logEvent("chat.rate_limit", { childId: child.id });
    return new Response(streamText(refusal), { headers: sseHeaders });
  }

  const quota = await checkQuotas(child.parentId, child.id);
  if (!quota.allowed) {
    const refusal =
      "امروز به سقف مجاز رسیدیم. لطفا از والدینت بخواه اگر لازم بود پلن را ارتقا دهند.";
    logEvent("chat.quota_block", { childId: child.id, reason: quota.reason });
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
    logEvent("chat.topic_block", { childId: child.id, type: "blacklist" });
    return new Response(streamText(refusal), { headers: sseHeaders });
  }
  if (whitelist.length > 0 && !whitelist.some((item) => item && lower.includes(item.toLowerCase()))) {
    const refusal = "این موضوع خارج از موضوعات مجاز است. بیا از لیست موضوعات مورد تایید انتخاب کنیم.";
    logEvent("chat.topic_block", { childId: child.id, type: "whitelist" });
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
    logEvent("chat.precheck_block", { childId: child.id, type: preCheck.type });
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
    logEvent("chat.postcheck_block", { childId: child.id, type: postCheck.type });
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

  await prisma.usageLedger.create({
    data: {
      parentId: child.parentId,
      childId: child.id,
      messages: 1,
      tokens: completion.usage?.total_tokens ?? 0,
      model: completion.raw?.model ?? "",
      costEstimate: 0,
      outcome: postCheck.action,
      latencyMs
    }
  });
  logEvent("chat.complete", {
    childId: child.id,
    tokens: completion.usage?.total_tokens ?? 0,
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
