export type PaymentIntentResult = {
  url?: string;
  reference?: string;
};

export interface PaymentProvider {
  name: string;
  createCheckout(input: {
    subscriptionId: string;
    amount: number;
    currency: string;
    customerEmail: string;
  }): Promise<PaymentIntentResult>;
  handleWebhook?(payload: string, signature: string | null): Promise<void>;
  activateManual?(input: { subscriptionId: string; reference: string }): Promise<void>;
}
