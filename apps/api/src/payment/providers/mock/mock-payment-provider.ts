import { Injectable } from '@nestjs/common';

import { PaymentProviderKey } from '../../payment-provider.enum';
import type {
  CreateCheckoutResult,
  CreateSubscriptionResult,
  GetInvoiceHistoryResult,
  OpenBillingPortalResult,
} from '../../payment-provider.types';
import type { PaymentProvider } from '../../payment-provider.interface';

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  readonly key = PaymentProviderKey.STRIPE;

  createCheckout(planId: string): Promise<CreateCheckoutResult> {
    // Mock only — no external calls
    return Promise.resolve({
      checkoutUrl: `https://mock-checkout.local/${this.key}/${encodeURIComponent(planId)}`,
      providerSubscriptionId: `mock_sub_${this.key}_${planId}`,
    });
  }

  createSubscription(planId: string): Promise<CreateSubscriptionResult> {
    // Mock only — no external calls
    return Promise.resolve({
      checkoutUrl: `https://mock-subscription.local/${this.key}/${encodeURIComponent(planId)}`,
      providerSubscriptionId: `mock_sub_${this.key}_${planId}`,
    });
  }

  openBillingPortal(): Promise<OpenBillingPortalResult> {
    return Promise.resolve({
      url: `https://mock-portal.local/${this.key}`,
    });
  }

  getInvoiceHistory(): Promise<GetInvoiceHistoryResult> {
    const now = new Date();
    const iso = now.toISOString();

    return Promise.resolve({
      invoices: [
        {
          id: `mock_inv_${this.key}_1`,
          amount: 4900,
          currency: 'USD',
          status: 'paid',
          issuedAt: iso,
        },
      ],
    });
  }
}
