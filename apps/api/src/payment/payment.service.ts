import { Injectable } from '@nestjs/common';

import { PaymentProviderKey } from './payment-provider.enum';
import type { PaymentProvider } from './payment-provider.interface';
import { PaymentProviderFactory } from './payment-provider.factory';
import type {
  CreateCheckoutResult,
  CreateSubscriptionResult,
  GetInvoiceHistoryResult,
  OpenBillingPortalResult,
} from './payment-provider.types';

@Injectable()
export class PaymentService {
  constructor(private readonly factory: PaymentProviderFactory) {}

  private getProvider(providerKey: PaymentProviderKey): PaymentProvider {
    return this.factory.getProvider(providerKey);
  }

  async createCheckout(
    providerKey: PaymentProviderKey,
    planId: string,
  ): Promise<CreateCheckoutResult> {
    return this.getProvider(providerKey).createCheckout(planId);
  }

  async createSubscription(
    providerKey: PaymentProviderKey,
    planId: string,
  ): Promise<CreateSubscriptionResult> {
    return this.getProvider(providerKey).createSubscription(planId);
  }

  async openBillingPortal(
    providerKey: PaymentProviderKey,
  ): Promise<OpenBillingPortalResult> {
    return this.getProvider(providerKey).openBillingPortal();
  }

  async getInvoiceHistory(
    providerKey: PaymentProviderKey,
  ): Promise<GetInvoiceHistoryResult> {
    return this.getProvider(providerKey).getInvoiceHistory();
  }
}
