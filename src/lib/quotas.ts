import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { prisma } from "@/lib/db";

export type PlanLimits = {
  messagesPerDay?: number;
  messagesPerDayPerChild?: number;
  tokensPerMonth?: number;
  childrenLimit?: number;
  seats?: number;
};

export async function getActiveSubscription(parentId: string) {
  return prisma.subscription.findFirst({
    where: { parentId, status: "ACTIVE" },
    include: { plan: true }
  });
}

export async function checkQuotas(parentId: string, childId: string) {
  const subscription = await getActiveSubscription(parentId);
  if (!subscription) {
    return {
      allowed: false,
      reason: "NO_ACTIVE_SUB",
      plan: null
    };
  }

  const limits = subscription.plan.limits as PlanLimits;
  const now = new Date();
  const [dailyUsage, monthlyUsage] = await Promise.all([
    prisma.usageLedger.aggregate({
      where: {
        parentId,
        childId,
        date: {
          gte: startOfDay(now),
          lte: endOfDay(now)
        }
      },
      _sum: { messages: true }
    }),
    prisma.usageLedger.aggregate({
      where: {
        parentId,
        date: {
          gte: startOfMonth(now),
          lte: endOfMonth(now)
        }
      },
      _sum: { tokens: true }
    })
  ]);

  const messagesToday = dailyUsage._sum.messages ?? 0;
  const tokensThisMonth = monthlyUsage._sum.tokens ?? 0;

  const dailyLimit = limits.messagesPerDayPerChild ?? limits.messagesPerDay;
  const warnings: string[] = [];
  if (dailyLimit && messagesToday >= dailyLimit * 0.8) {
    warnings.push("DAILY_80");
  }
  if (limits.tokensPerMonth && tokensThisMonth >= limits.tokensPerMonth * 0.8) {
    warnings.push("MONTHLY_80");
  }
  if (dailyLimit && messagesToday >= dailyLimit) {
    return {
      allowed: false,
      reason: "DAILY_MESSAGE_LIMIT",
      plan: subscription.plan,
      usage: { messagesToday, tokensThisMonth },
      warnings
    };
  }

  if (limits.tokensPerMonth && tokensThisMonth >= limits.tokensPerMonth) {
    return {
      allowed: false,
      reason: "MONTHLY_TOKEN_LIMIT",
      plan: subscription.plan,
      usage: { messagesToday, tokensThisMonth },
      warnings
    };
  }

  return {
    allowed: true,
    reason: "OK",
    plan: subscription.plan,
    usage: { messagesToday, tokensThisMonth },
    warnings
  };
}
