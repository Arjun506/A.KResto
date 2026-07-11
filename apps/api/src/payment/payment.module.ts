import { Module } from '@nestjs/common';

import { PaymentProviderFactory } from './payment-provider.factory';
import { PaymentService } from './payment.service';
import { MockPaymentProvider } from './providers/mock/mock-payment-provider';

@Module({
  providers: [PaymentProviderFactory, PaymentService, MockPaymentProvider],
  exports: [PaymentService, PaymentProviderFactory],
})
export class PaymentModule {}
