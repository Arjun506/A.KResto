import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GatewayAdapterFactory } from '../gateway-abstraction/gateway-adapter.factory';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  PaymentAuthorizedEvent,
  PaymentFailedEvent,
} from '../../event-bus/events/payment.events';
import { GatewayHealthMonitorService } from '../health-monitor/health-monitor.service';

@Injectable()
export class PaymentAuthorizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gatewayFactory: GatewayAdapterFactory,
    private readonly eventBus: EventBusService,
    private readonly healthMonitor: GatewayHealthMonitorService,
  ) {}

  async authorizePayment(paymentTransactionId: string, token: string) {
    const payment = await this.prisma.payment_transactions.findUnique({
      where: { id: paymentTransactionId },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment transaction ${paymentTransactionId} not found`,
      );
    }

    if (payment.status !== 'PENDING') {
      throw new BadRequestException(
        `Payment ${paymentTransactionId} is not in PENDING state`,
      );
    }

    const adapter = this.gatewayFactory.getAdapter(
      payment.gatewayName || 'MOCK',
    );
    const start = Date.now();
    try {
      const response = await adapter.authorize(
        payment.amount,
        payment.currency,
        token,
      );
      const latency = Date.now() - start;

      await this.healthMonitor.trackHealth(
        payment.gatewayName || 'MOCK',
        response.success,
        latency,
      );

      if (response.success) {
        const updated = await this.prisma.payment_transactions.update({
          where: { id: paymentTransactionId },
          data: {
            status: 'AUTHORIZED',
            authorizedAmount: payment.amount,
            gatewayRef: response.transactionRef,
            authCode: response.authCode,
            feeAmount: response.feeAmount,
          },
        });

        await this.eventBus.publish(
          new PaymentAuthorizedEvent(
            payment.id,
            { paymentId: payment.id, amount: payment.amount },
            payment.tenantId || undefined,
          ),
        );

        return updated;
      } else {
        await this.prisma.payment_transactions.update({
          where: { id: paymentTransactionId },
          data: { status: 'FAILED' },
        });

        await this.eventBus.publish(
          new PaymentFailedEvent(
            payment.id,
            {
              paymentId: payment.id,
              reason: response.errorMessage || 'Auth Rejected',
            },
            payment.tenantId || undefined,
          ),
        );

        throw new BadRequestException(
          response.errorMessage || 'Gateway authorization failed',
        );
      }
    } catch (err: any) {
      const latency = Date.now() - start;
      await this.healthMonitor.trackHealth(
        payment.gatewayName || 'MOCK',
        false,
        latency,
      );

      await this.prisma.payment_transactions.update({
        where: { id: paymentTransactionId },
        data: { status: 'FAILED' },
      });

      await this.eventBus.publish(
        new PaymentFailedEvent(
          payment.id,
          { paymentId: payment.id, reason: err.message || 'Auth Exception' },
          payment.tenantId || undefined,
        ),
      );

      throw err;
    }
  }
}
