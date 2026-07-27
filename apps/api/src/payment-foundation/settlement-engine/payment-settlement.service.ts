import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  SettlementStartedEvent,
  SettlementCompletedEvent,
} from '../../event-bus/events/payment.events';

@Injectable()
export class PaymentSettlementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createSettlementBatch(
    tenantId: string,
    businessId: string,
    gross: number,
    fee: number,
  ) {
    const net = gross - fee;
    const batchNum = `SET-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const settlement = await this.prisma.payment_settlements.create({
      data: {
        tenantId,
        businessId,
        settlementBatchNumber: batchNum,
        grossAmount: gross,
        feeAmount: fee,
        netAmount: net,
        status: 'UNSETTLED',
      },
    });

    await this.eventBus.publish(
      new SettlementStartedEvent(
        settlement.id,
        { batchId: settlement.id, amount: net },
        tenantId,
      ),
    );

    return settlement;
  }

  async markSettled(id: string) {
    const settlement = await this.prisma.payment_settlements.update({
      where: { id },
      data: {
        status: 'SETTLED',
        settledAt: new Date(),
      },
    });

    await this.eventBus.publish(
      new SettlementCompletedEvent(
        id,
        { batchId: id, status: 'SETTLED' },
        settlement.tenantId || undefined,
      ),
    );

    return settlement;
  }

  async getSettlements(businessId?: string) {
    const where = businessId ? { businessId } : {};
    return this.prisma.payment_settlements.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
