import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GatewayAdapterFactory } from '../gateway-abstraction/gateway-adapter.factory';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  RefundCreatedEvent,
  RefundCompletedEvent,
} from '../../event-bus/events/payment.events';

@Injectable()
export class PaymentRefundService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gatewayFactory: GatewayAdapterFactory,
    private readonly eventBus: EventBusService,
  ) {}

  async refundPayment(
    paymentTransactionId: string,
    amount: number,
    reasonCode: string,
    notes?: string,
  ) {
    const payment = await this.prisma.payment_transactions.findUnique({
      where: { id: paymentTransactionId },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment transaction ${paymentTransactionId} not found`,
      );
    }

    if (
      payment.status !== 'CAPTURED' &&
      payment.status !== 'PARTIALLY_REFUNDED'
    ) {
      throw new BadRequestException(`Payment is not captured`);
    }

    const remainingRefundable = payment.capturedAmount - payment.refundedAmount;
    if (amount > remainingRefundable) {
      throw new BadRequestException(
        `Refund amount exceeds remaining captured balance`,
      );
    }

    const adapter = this.gatewayFactory.getAdapter(
      payment.gatewayName || 'MOCK',
    );
    const response = await adapter.refund(payment.gatewayRef || '', amount);

    if (response.success) {
      const refundNum = `REF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

      const refund = await this.prisma.payment_refunds.create({
        data: {
          paymentTransactionId,
          refundNumber: refundNum,
          amount,
          reasonCode,
          status: 'COMPLETED',
          gatewayRefundRef: response.transactionRef,
          notes,
        },
      });

      await this.eventBus.publish(
        new RefundCreatedEvent(
          refund.id,
          { refundId: refund.id, paymentId: paymentTransactionId, amount },
          payment.tenantId || undefined,
        ),
      );

      const nextRefundedAmount = payment.refundedAmount + amount;
      const nextStatus =
        nextRefundedAmount === payment.capturedAmount
          ? 'REFUNDED'
          : 'PARTIALLY_REFUNDED';

      await this.prisma.payment_transactions.update({
        where: { id: paymentTransactionId },
        data: {
          status: nextStatus,
          refundedAmount: nextRefundedAmount,
        },
      });

      await this.eventBus.publish(
        new RefundCompletedEvent(
          refund.id,
          { refundId: refund.id, paymentId: paymentTransactionId, amount },
          payment.tenantId || undefined,
        ),
      );

      return refund;
    } else {
      throw new BadRequestException(
        response.errorMessage || 'Gateway refund failed',
      );
    }
  }

  async getRefunds(paymentTransactionId: string) {
    return this.prisma.payment_refunds.findMany({
      where: { paymentTransactionId },
    });
  }
}
