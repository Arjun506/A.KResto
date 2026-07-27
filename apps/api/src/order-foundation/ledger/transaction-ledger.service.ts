import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionLedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrderLedger(orderId: string) {
    const transactions = await this.prisma.transactions_registry.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });

    const totalDebits = transactions.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );

    return {
      orderId,
      totalDebits,
      transactionCount: transactions.length,
      transactions,
    };
  }
}
