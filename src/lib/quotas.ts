import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { prisma } from "@/lib/db";

export type PlanQuotas = {
  dailyMessagesPerChild?: number;
  dailyTokensPerChild?: number;
  dailyTokensShared?: number;
  monthlyTokenCap?: number;
  rateLimits?: {
    parentRPM?: number;
    childRPM?: number;
    childConcurrency?: number;
    ipAuthRPM?: number;
  };
};

export type PlanFeatures = {
  progressReport?: boolean;
  smartStory?: boolean;
  pdfReport?: boolean;
  priority?: boolean;
};

export async function getActiveSubscription(parentId: string) {
  return prisma.subscription.findFirst({
    where: { parentId, status: "ACTIVE" },
    include: { plan: true, parent: true }
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

  const quotas = (subscription.plan.quotasJson ?? {}) as PlanQuotas;
  const now = new Date();
  const [dailyUsageChild, dailyUsageParent, monthlyUsageParent] = await Promise.all([
    prisma.usageLedger.aggregate({
      where: {
        parentId,
        childId,
        date: {
          gte: startOfDay(now),
          lte: endOfDay(now)
        }
      },
      _sum: { messagesCount: true, totalTokens: true }
    }),
    prisma.usageLedger.aggregate({
      where: {
        parentId,
        date: {
          gte: startOfDay(now),
          lte: endOfDay(now)
        }
      },
      _sum: { totalTokens: true }
    }),
    prisma.usageLedger.aggregate({
      where: {
        parentId,
        date: {
          gte: startOfMonth(now),
          lte: endOfMonth(now)
        }
      },
      _sum: { totalTokens: true }
    })
  ]);

  const messagesToday = dailyUsageChild._sum.messagesCount ?? 0;
  const tokensTodayChild = dailyUsageChild._sum.totalTokens ?? 0;
  const tokensTodayShared = dailyUsageParent._sum.totalTokens ?? 0;
  const tokensThisMonth = monthlyUsageParent._sum.totalTokens ?? 0;

  const warnings: string[] = [];
  if (quotas.dailyMessagesPerChild && messagesToday >= quotas.dailyMessagesPerChild * 0.8) {
    warnings.push("DAILY_MESSAGES_80");
  }
  if (quotas.dailyTokensPerChild && tokensTodayChild >= quotas.dailyTokensPerChild * 0.8) {
    warnings.push("DAILY_TOKENS_CHILD_80");
  }
  if (quotas.dailyTokensShared && tokensTodayShared >= quotas.dailyTokensShared * 0.8) {
    warnings.push("DAILY_TOKENS_SHARED_80");
  }
  if (quotas.monthlyTokenCap && tokensThisMonth >= quotas.monthlyTokenCap * 0.8) {
    warnings.push("MONTHLY_TOKENS_80");
  }

  if (quotas.dailyMessagesPerChild && messagesToday >= quotas.dailyMessagesPerChild) {
    return {
      allowed: false,
      reason: "DAILY_MESSAGE_LIMIT",
      plan: subscription.plan,
      usage: { messagesToday, tokensThisMonth, tokensTodayChild, tokensTodayShared },
      warnings
    };
  }

  if (quotas.dailyTokensPerChild && tokensTodayChild >= quotas.dailyTokensPerChild) {
    return {
      allowed: false,
      reason: "DAILY_TOKEN_CHILD_LIMIT",
      plan: subscription.plan,
      usage: { messagesToday, tokensThisMonth, tokensTodayChild, tokensTodayShared },
      warnings
    };
  }

  if (quotas.dailyTokensShared && tokensTodayShared >= quotas.dailyTokensShared) {
    return {
      allowed: false,
      reason: "DAILY_TOKEN_SHARED_LIMIT",
      plan: subscription.plan,
      usage: { messagesToday, tokensThisMonth, tokensTodayChild, tokensTodayShared },
      warnings
    };
  }

  if (quotas.monthlyTokenCap && tokensThisMonth >= quotas.monthlyTokenCap) {
    return {
      allowed: false,
      reason: "MONTHLY_TOKEN_LIMIT",
      plan: subscription.plan,
      usage: { messagesToday, tokensThisMonth, tokensTodayChild, tokensTodayShared },
      warnings
    };
  }

  return {
    allowed: true,
    reason: "OK",
    plan: subscription.plan,
    usage: { messagesToday, tokensThisMonth, tokensTodayChild, tokensTodayShared },
    warnings
  };
}
