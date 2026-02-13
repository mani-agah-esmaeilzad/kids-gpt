import type { PaymentProvider } from "@/lib/payments/provider";
import { prisma } from "@/lib/db";

export class ManualPaymentProvider implements PaymentProvider {
  name = "manual";

  async createCheckout() {
    return { reference: "manual" };
  }

  async activateManual(input: { subscriptionId: string; reference: string }) {
    await prisma.payment.create({
      data: {
        subscriptionId: input.subscriptionId,
        provider: this.name,
        amount: 0,
        currency: "IRR",
        status: "PAID",
        reference: input.reference
      }
    });
    await prisma.subscription.update({
      where: { id: input.subscriptionId },
      data: { status: "ACTIVE" }
    });
  }
}
