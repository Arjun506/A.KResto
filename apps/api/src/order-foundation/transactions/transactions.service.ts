import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionRecordDto } from './dto/create-transaction.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { TransactionCreatedEvent } from '../../event-bus/events/order.events';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createTransaction(dto: CreateTransactionRecordDto) {
    const tx = await this.prisma.transactions_registry.create({
      data: {
        tenantId: dto.tenantId,
        orderId: dto.orderId,
        businessId: dto.businessId,
        customerId: dto.customerId,
        transactionNumber: dto.transactionNumber,
        transactionType: dto.transactionType,
        amount: dto.amount,
        currency: dto.currency || 'USD',
        status: 'COMPLETED',
        paymentMethod: dto.paymentMethod,
        referenceNumber: dto.referenceNumber,
        metadata: dto.metadata,
      },
    });

    await this.eventBus.publish(
      new TransactionCreatedEvent(
        tx.id,
        {
          transactionId: tx.id,
          transactionNumber: tx.transactionNumber,
          transactionType: tx.transactionType,
          amount: tx.amount,
        },
        tx.tenantId || undefined,
      ),
    );

    return tx;
  }

  async getTransactions(tenantId?: string, orderId?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (orderId) where.orderId = orderId;

    return this.prisma.transactions_registry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
