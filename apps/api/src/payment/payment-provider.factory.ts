import { Injectable } from '@nestjs/common';

import { PaymentProviderKey } from './payment-provider.enum';
import type { PaymentProvider } from './payment-provider.interface';
import { MockPaymentProvider } from './providers/mock/mock-payment-provider';

@Injectable()
export class PaymentProviderFactory {
  constructor(private readonly mockProvider: MockPaymentProvider) {}

  getProvider(key: PaymentProviderKey): PaymentProvider {
    // Mock-only right now: all keys map to the same mock provider.
    // Later: register real provider implementations.
    if (!Object.values(PaymentProviderKey).includes(key)) {
      throw new Error(`Unsupported PaymentProviderKey: ${String(key)}`);
    }

    // If we later add multiple mock providers, this is where we'd branch.
    return {
      ...this.mockProvider,
      // ensure mock URL paths reflect the selected provider
      key,
    } as unknown as PaymentProvider;
  }
}
