import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  ChargebackOpenedEvent,
  ChargebackResolvedEvent,
} from '../../event-bus/events/payment.events';

@Injectable()
export class PaymentDisputesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async openDispute(
    paymentTransactionId: string,
    disputeNumber: string,
    reason: string,
    amount: number,
  ) {
    const dispute = await this.prisma.payment_disputes.create({
      data: {
        paymentTransactionId,
        disputeNumber,
        reason,
        amount,
        status: 'OPEN',
      },
    });

    await this.eventBus.publish(
      new ChargebackOpenedEvent(dispute.id, {
        disputeId: dispute.id,
        paymentId: paymentTransactionId,
        amount,
      }),
    );

    return dispute;
  }

  async uploadEvidence(id: string, urls: string[]) {
    const dispute = await this.prisma.payment_disputes.findUnique({
      where: { id },
    });
    if (!dispute) {
      throw new NotFoundException(`Dispute with ID ${id} not found`);
    }

    return this.prisma.payment_disputes.update({
      where: { id },
      data: {
        evidenceUrls: {
          set: [...dispute.evidenceUrls, ...urls],
        },
      },
    });
  }

  async resolveDispute(id: string, result: 'WON' | 'LOST') {
    const dispute = await this.prisma.payment_disputes.findUnique({
      where: { id },
    });
    if (!dispute) {
      throw new NotFoundException(`Dispute with ID ${id} not found`);
    }

    const updated = await this.prisma.payment_disputes.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        arbitrationResult: result,
      },
    });

    await this.eventBus.publish(
      new ChargebackResolvedEvent(id, { disputeId: id, status: 'RESOLVED' }),
    );

    return updated;
  }

  async getDisputes(paymentTransactionId?: string) {
    const where = paymentTransactionId ? { paymentTransactionId } : {};
    return this.prisma.payment_disputes.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
