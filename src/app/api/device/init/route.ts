import { NextResponse } from "next/server";
import { getOrCreateDeviceId } from "@/lib/device-session";
import { prisma } from "@/lib/db";

export async function POST() {
  const deviceId = await getOrCreateDeviceId();
  await prisma.kidDeviceSession.upsert({
    where: { deviceId },
    update: { lastSeenAt: new Date() },
    create: { deviceId }
  });
  return NextResponse.json({ deviceId });
}
