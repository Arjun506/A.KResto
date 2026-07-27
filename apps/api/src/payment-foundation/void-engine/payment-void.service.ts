import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GatewayAdapterFactory } from '../gateway-abstraction/gateway-adapter.factory';
import { EventBusService } from '../../event-bus/event-bus.service';
import { PaymentVoidedEvent } from '../../event-bus/events/payment.events';

@Injectable()
export class PaymentVoidService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gatewayFactory: GatewayAdapterFactory,
    private readonly eventBus: EventBusService,
  ) {}

  async voidPayment(paymentTransactionId: string) {
    const payment = await this.prisma.payment_transactions.findUnique({
      where: { id: paymentTransactionId },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment transaction ${paymentTransactionId} not found`,
      );
    }

    if (payment.status !== 'AUTHORIZED') {
      throw new BadRequestException(
        `Only AUTHORIZED (uncaptured) payments can be voided`,
      );
    }

    const adapter = this.gatewayFactory.getAdapter(
      payment.gatewayName || 'MOCK',
    );
    const response = await adapter.void(payment.gatewayRef || '');

    if (response.success) {
      const updated = await this.prisma.payment_transactions.update({
        where: { id: paymentTransactionId },
        data: { status: 'VOIDED' },
      });

      await this.eventBus.publish(
        new PaymentVoidedEvent(
          payment.id,
          { paymentId: payment.id },
          payment.tenantId || undefined,
        ),
      );

      return updated;
    } else {
      throw new BadRequestException(
        response.errorMessage || 'Gateway void transaction failed',
      );
    }
  }
}
