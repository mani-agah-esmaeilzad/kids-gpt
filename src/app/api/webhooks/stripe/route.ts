import { NextResponse } from "next/server";
import { StripePaymentProvider } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();
  try {
    const provider = new StripePaymentProvider();
    await provider.handleWebhook(payload, signature);
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
