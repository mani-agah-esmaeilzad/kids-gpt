import { prisma } from "@/lib/db";
import { LogSeverity, Prisma } from "@prisma/client";

type LogPayload = Record<string, unknown> & {
  userId?: string;
  childId?: string;
  requestId?: string;
  message?: string;
};

export async function logEvent(
  eventType: string,
  payload: LogPayload,
  severity: LogSeverity = "INFO"
) {
  const entry = {
    eventType,
    severity,
    timestamp: new Date().toISOString(),
    ...payload
  };
  console.log(JSON.stringify(entry));

  try {
    const { userId, childId, requestId, message, ...metadata } = payload;
    await prisma.logEvent.create({
      data: {
        eventType,
        severity,
        message,
        userId,
        childId,
        requestId,
        metadata: metadata as Prisma.InputJsonValue
      }
    });
  } catch {
    // swallow logging errors
  }
}
