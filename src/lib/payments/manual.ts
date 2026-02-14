import type { PaymentProvider } from "@/lib/payments/provider";
import { prisma } from "@/lib/db";

export class ManualPaymentProvider implements PaymentProvider {
  name = "manual";

  async createCheckout() {
    return { reference: "manual" };
  }

  async activateManual(input: { subscriptionId: string; userId: string; reference: string }) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: input.subscriptionId },
      include: { plan: true }
    });
    if (!subscription) return;
    await prisma.payment.create({
      data: {
        userId: input.userId,
        subscriptionId: input.subscriptionId,
        provider: this.name,
        amountToman: subscription.plan.priceMonthlyToman,
        status: "PAID",
        providerRef: input.reference,
        feeToman: 0
      }
    });
    await prisma.revenueLedger.create({
      data: {
        userId: input.userId,
        subscriptionId: input.subscriptionId,
        amountToman: subscription.plan.priceMonthlyToman,
        notes: "Manual activation"
      }
    });
    await prisma.subscription.update({
      where: { id: input.subscriptionId },
      data: { status: "ACTIVE", provider: this.name, providerRef: input.reference }
    });
  }
}
