import Stripe from "stripe";
import { prisma } from "@/lib/db";
import type { PaymentProvider } from "@/lib/payments/provider";

export class StripePaymentProvider implements PaymentProvider {
  name = "stripe";
  private stripe: Stripe;

  constructor() {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      throw new Error("STRIPE_SECRET_KEY is missing");
    }
    this.stripe = new Stripe(secret, { apiVersion: "2024-04-10" });
  }

  async createCheckout(input: {
    subscriptionId: string;
    amount: number;
    currency: string;
    customerEmail: string;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: input.currency.toLowerCase(),
            unit_amount: input.amount,
            product_data: {
              name: "GPTKids Subscription"
            }
          }
        }
      ],
      metadata: {
        subscriptionId: input.subscriptionId
      },
      success_url: `${process.env.NEXTAUTH_URL}/parent/billing?success=1`,
      cancel_url: `${process.env.NEXTAUTH_URL}/parent/billing?canceled=1`
    });

    await prisma.payment.create({
      data: {
        subscriptionId: input.subscriptionId,
        provider: this.name,
        amount: input.amount,
        currency: input.currency,
        status: "PENDING",
        reference: session.id
      }
    });

    return { url: session.url ?? undefined, reference: session.id };
  }

  async handleWebhook(payload: string, signature: string | null) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret || !signature) return;
    const event = this.stripe.webhooks.constructEvent(payload, signature, secret);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.metadata?.subscriptionId;
      if (subscriptionId) {
        await prisma.payment.updateMany({
          where: { reference: session.id },
          data: { status: "PAID" }
        });
        await prisma.subscription.update({
          where: { id: subscriptionId },
          data: { status: "ACTIVE" }
        });
      }
    }
  }
}
