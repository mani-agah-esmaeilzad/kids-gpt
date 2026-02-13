import { ManualPaymentProvider } from "@/lib/payments/manual";
import { StripePaymentProvider } from "@/lib/payments/stripe";

export const paymentProviders = {
  manual: new ManualPaymentProvider(),
  stripe: (() => {
    try {
      return new StripePaymentProvider();
    } catch {
      return null;
    }
  })()
};
