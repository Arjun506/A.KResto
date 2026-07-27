import { Module } from '@nestjs/common';

import { PaymentProviderFactory } from './payment-provider.factory';
import { PaymentService } from './payment.service';
import { MockPaymentProvider } from './providers/mock/mock-payment-provider';
import { BillingController } from './billing.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BillingController],
  providers: [
    PaymentProviderFactory,
    PaymentService,
    MockPaymentProvider,
    PrismaService,
  ],
  exports: [PaymentService, PaymentProviderFactory],
})
export class PaymentModule {}
