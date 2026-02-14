import { prisma } from "@/lib/db";
import type { PlanQuotas } from "@/lib/quotas";

export type RateLimitPolicy = {
  parentRPM: number;
  childRPM: number;
  childConcurrency: number;
  ipAuthRPM: number;
  globalMultiplier: number;
  emergencyThrottle: boolean;
  banUntil?: string;
  isBanned: boolean;
};

export async function resolveRateLimits(parentId: string, quotasJson: PlanQuotas) {
  const defaults = {
    parentRPM: quotasJson.rateLimits?.parentRPM ?? 30,
    childRPM: quotasJson.rateLimits?.childRPM ?? 10,
    childConcurrency: quotasJson.rateLimits?.childConcurrency ?? 2,
    ipAuthRPM: quotasJson.rateLimits?.ipAuthRPM ?? 8
  };

  const [config, parent] = await Promise.all([
    prisma.appConfig.findUnique({ where: { key: "rate.limits" } }),
    prisma.parentProfile.findUnique({ where: { id: parentId } })
  ]);

  const configValue = (config?.value as any) ?? {};
  const globalMultiplier = Number(configValue.globalMultiplier ?? 1);
  const emergencyThrottle = Boolean(configValue.emergencyThrottle ?? false);

  const parentPrefs = (parent?.preferences as any) ?? {};
  const parentMultiplier = Number(parentPrefs.rateLimitMultiplier ?? 1);
  const banUntil = parentPrefs.banUntil ?? undefined;
  const isBanned = Boolean(parentPrefs.isBanned) || (banUntil ? new Date(banUntil) > new Date() : false);

  const multiplier = Math.max(globalMultiplier * parentMultiplier, 0.1);
  const throttled = emergencyThrottle ? 0.5 : 1;

  return {
    parentRPM: Math.max(1, Math.floor(defaults.parentRPM * multiplier * throttled)),
    childRPM: Math.max(1, Math.floor(defaults.childRPM * multiplier * throttled)),
    childConcurrency: Math.max(1, Math.floor(defaults.childConcurrency * multiplier)),
    ipAuthRPM: Math.max(1, Math.floor(defaults.ipAuthRPM * multiplier)),
    globalMultiplier,
    emergencyThrottle,
    banUntil,
    isBanned
  } satisfies RateLimitPolicy;
}
