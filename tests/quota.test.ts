import { describe, it, expect, vi } from "vitest";
import { checkQuotas } from "@/lib/quotas";

vi.mock("@/lib/db", () => {
  return {
    prisma: {
      subscription: {
        findFirst: vi.fn().mockResolvedValue({
          plan: {
            limits: { messagesPerDay: 1, tokensPerMonth: 10 }
          }
        })
      },
      usageLedger: {
        aggregate: vi
          .fn()
          .mockResolvedValueOnce({ _sum: { messages: 1 } })
          .mockResolvedValueOnce({ _sum: { tokens: 5 } })
      }
    }
  };
});

describe("checkQuotas", () => {
  it("blocks when daily limit reached", async () => {
    const result = await checkQuotas("p1", "c1");
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("DAILY_MESSAGE_LIMIT");
  });
});
