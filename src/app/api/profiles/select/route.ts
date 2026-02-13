import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getOrCreateDeviceId, setKidModeCookie, getKidSession } from "@/lib/device-session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.childId) {
    return NextResponse.json({ error: "Missing childId" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  let allowedParentId: string | null = null;

  if (session?.user?.id) {
    const parent = await prisma.parentProfile.findFirst({ where: { userId: session.user.id } });
    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }
    allowedParentId = parent.id;
  } else {
    const existing = await getKidSession();
    if (existing?.activeChildId) {
      const activeChild = await prisma.childProfile.findUnique({
        where: { id: existing.activeChildId }
      });
      allowedParentId = activeChild?.parentId ?? null;
    }
  }

  if (!allowedParentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const child = await prisma.childProfile.findUnique({ where: { id: body.childId } });
  if (!child) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 });
  }
  if (!child.isActive) {
    return NextResponse.json({ error: "Profile disabled" }, { status: 403 });
  }

  if (allowedParentId && child.parentId !== allowedParentId) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const deviceId = await getOrCreateDeviceId();
  await prisma.kidDeviceSession.upsert({
    where: { deviceId },
    update: { activeChildId: child.id, lastSeenAt: new Date() },
    create: { deviceId, activeChildId: child.id }
  });

  setKidModeCookie();

  return NextResponse.json({ ok: true });
}
