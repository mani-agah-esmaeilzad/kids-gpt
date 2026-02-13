import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ManualPaymentProvider } from "@/lib/payments/manual";

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
  const provider = new ManualPaymentProvider();
  await provider.activateManual({
    subscriptionId: body.subscriptionId,
    reference: body.reference ?? "manual"
  });
  return NextResponse.json({ ok: true });
}
