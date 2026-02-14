import { redis } from "@/lib/redis";

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
) {
  try {
    const redisKey = `ratelimit:${key}`;
    const pipeline = redis.pipeline();
    pipeline.incr(redisKey);
    pipeline.ttl(redisKey);
    const results = await pipeline.exec();
    if (!results) {
      throw new Error("Redis pipeline failed");
    }
    const [countRes, ttlRes] = results;
    const count = typeof countRes?.[1] === "number" ? (countRes[1] as number) : 0;
    let ttl = typeof ttlRes?.[1] === "number" ? (ttlRes[1] as number) : -1;
    if (count === 1 || ttl === -1) {
      await redis.expire(redisKey, windowSeconds);
      ttl = windowSeconds;
    }
    return {
      allowed: count <= limit,
      remaining: Math.max(limit - count, 0),
      resetIn: ttl
    };
  } catch {
    return { allowed: true, remaining: limit, resetIn: windowSeconds };
  }
}

export async function acquireConcurrencySlot(
  key: string,
  limit: number,
  ttlSeconds: number
) {
  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, ttlSeconds);
    }
    if (current > limit) {
      await redis.decr(key);
      return { allowed: false, current };
    }
    return { allowed: true, current };
  } catch {
    return { allowed: true, current: 0 };
  }
}
