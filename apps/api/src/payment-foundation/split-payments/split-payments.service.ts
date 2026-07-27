import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { SplitPaymentCreatedEvent } from '../../event-bus/events/payment.events';

@Injectable()
export class SplitPaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createSplit(
    paymentTransactionId: string,
    splits: Array<{ tenderType: string; amount: number; referenceId?: string }>,
  ) {
    const createdSplits = await Promise.all(
      splits.map((s) =>
        this.prisma.payment_splits.create({
          data: {
            paymentTransactionId,
            tenderType: s.tenderType,
            amount: s.amount,
            referenceId: s.referenceId,
          },
        }),
      ),
    );

    const payment = await this.prisma.payment_transactions.findUnique({
      where: { id: paymentTransactionId },
    });

    await this.eventBus.publish(
      new SplitPaymentCreatedEvent(
        paymentTransactionId,
        {
          paymentId: paymentTransactionId,
          splits: splits.map((s) => ({ type: s.tenderType, amount: s.amount })),
        },
        payment?.tenantId || undefined,
      ),
    );

    return createdSplits;
  }

  async getSplits(paymentTransactionId: string) {
    return this.prisma.payment_splits.findMany({
      where: { paymentTransactionId },
    });
  }
}
