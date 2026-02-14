export type PaymentIntentResult = {
  url?: string;
  reference?: string;
};

export interface PaymentProvider {
  name: string;
  createCheckout(input: {
    userId: string;
    subscriptionId: string;
    amountToman: number;
    customerEmail: string;
  }): Promise<PaymentIntentResult>;
  handleWebhook?(payload: string, signature: string | null): Promise<void>;
  activateManual?(input: { subscriptionId: string; userId: string; reference: string }): Promise<void>;
}
