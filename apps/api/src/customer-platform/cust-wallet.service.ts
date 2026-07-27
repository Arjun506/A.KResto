import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustWalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getWalletBalance(customerId: string) {
    const wallet = await this.prisma.cust_wallet_ledger.findUnique({
      where: { customerId },
    });
    return {
      customerId,
      balance: wallet?.balance ?? 0.0,
    };
  }

  async creditWallet(customerId: string, amount: number) {
    const wallet = await this.prisma.cust_wallet_ledger.upsert({
      where: { customerId },
      update: { balance: { increment: amount } },
      create: { customerId, balance: amount },
    });
    return wallet;
  }

  async getSubscriptionDetails(customerId: string) {
    return {
      customerId,
      status: 'ACTIVE',
      planName: 'GOLD_MEMBER',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
  }
}
