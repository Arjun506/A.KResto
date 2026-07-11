import type {
  CreateCheckoutResult,
  CreateSubscriptionResult,
  GetInvoiceHistoryResult,
  OpenBillingPortalResult,
} from './payment-provider.types';

export interface PaymentProvider {
  readonly key: string;

  createCheckout(planId: string): Promise<CreateCheckoutResult>;

  createSubscription(planId: string): Promise<CreateSubscriptionResult>;

  openBillingPortal(): Promise<OpenBillingPortalResult>;

  getInvoiceHistory(): Promise<GetInvoiceHistoryResult>;
}
