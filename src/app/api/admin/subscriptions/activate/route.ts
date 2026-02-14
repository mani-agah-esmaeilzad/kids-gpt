import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ManualPaymentProvider } from "@/lib/payments/manual";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body?.subscriptionId) {
    return NextResponse.json({ error: "Missing subscriptionId" }, { status: 400 });
  }
  const subscription = await prisma.subscription.findUnique({
    where: { id: body.subscriptionId },
    include: { parent: { include: { user: true } } }
  });
  if (!subscription) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }
  const provider = new ManualPaymentProvider();
  await provider.activateManual({
    subscriptionId: body.subscriptionId,
    userId: subscription.userId,
    reference: body.reference ?? "manual"
  });
  return NextResponse.json({ ok: true });
}
