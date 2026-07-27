import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GatewayAdapterFactory } from '../gateway-abstraction/gateway-adapter.factory';
import { EventBusService } from '../../event-bus/event-bus.service';
import { PaymentCapturedEvent } from '../../event-bus/events/payment.events';

@Injectable()
export class PaymentCaptureService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gatewayFactory: GatewayAdapterFactory,
    private readonly eventBus: EventBusService,
  ) {}

  async capturePayment(paymentTransactionId: string, captureAmount?: number) {
    const payment = await this.prisma.payment_transactions.findUnique({
      where: { id: paymentTransactionId },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment transaction ${paymentTransactionId} not found`,
      );
    }

    if (payment.status !== 'AUTHORIZED') {
      throw new BadRequestException(`Payment is not in AUTHORIZED state`);
    }

    const finalAmount = captureAmount ?? payment.amount;
    if (finalAmount > payment.amount) {
      throw new BadRequestException(`Capture amount exceeds authorized limit`);
    }

    const adapter = this.gatewayFactory.getAdapter(
      payment.gatewayName || 'MOCK',
    );
    const response = await adapter.capture(
      payment.gatewayRef || '',
      finalAmount,
    );

    if (response.success) {
      const updated = await this.prisma.payment_transactions.update({
        where: { id: paymentTransactionId },
        data: {
          status: 'CAPTURED',
          capturedAmount: finalAmount,
          feeAmount: payment.feeAmount + response.feeAmount,
        },
      });

      await this.eventBus.publish(
        new PaymentCapturedEvent(
          payment.id,
          { paymentId: payment.id, amount: finalAmount },
          payment.tenantId || undefined,
        ),
      );

      return updated;
    } else {
      throw new BadRequestException(
        response.errorMessage || 'Gateway capture failed',
      );
    }
  }
}
