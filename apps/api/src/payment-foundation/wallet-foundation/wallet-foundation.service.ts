import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  WalletCreditedEvent,
  WalletDebitedEvent,
} from '../../event-bus/events/payment.events';

@Injectable()
export class WalletFoundationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async creditWallet(
    customerId: string,
    amount: number,
    currency: string = 'USD',
    refType?: string,
    refId?: string,
  ) {
    let wallet = await this.prisma.customer_wallets.findUnique({
      where: { customerId_currency: { customerId, currency } },
    });

    if (!wallet) {
      wallet = await this.prisma.customer_wallets.create({
        data: { customerId, currency, balance: 0 },
      });
    }

    const updated = await this.prisma.customer_wallets.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } },
    });

    await this.prisma.wallet_ledger.create({
      data: {
        walletId: wallet.id,
        type: 'CREDIT',
        amount,
        balanceAfter: updated.balance,
        referenceType: refType,
        referenceId: refId,
      },
    });

    await this.eventBus.publish(
      new WalletCreditedEvent(wallet.id, {
        walletId: wallet.id,
        amount,
        balance: updated.balance,
      }),
    );

    return updated;
  }

  async debitWallet(
    customerId: string,
    amount: number,
    currency: string = 'USD',
    refType?: string,
    refId?: string,
  ) {
    const wallet = await this.prisma.customer_wallets.findUnique({
      where: { customerId_currency: { customerId, currency } },
    });

    if (!wallet || wallet.balance < amount) {
      throw new BadRequestException(`Insufficient wallet balance`);
    }

    const updated = await this.prisma.customer_wallets.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount } },
    });

    await this.prisma.wallet_ledger.create({
      data: {
        walletId: wallet.id,
        type: 'DEBIT',
        amount,
        balanceAfter: updated.balance,
        referenceType: refType,
        referenceId: refId,
      },
    });

    await this.eventBus.publish(
      new WalletDebitedEvent(wallet.id, {
        walletId: wallet.id,
        amount,
        balance: updated.balance,
      }),
    );

    return updated;
  }

  async getWallet(customerId: string, currency: string = 'USD') {
    return this.prisma.customer_wallets.findUnique({
      where: { customerId_currency: { customerId, currency } },
      include: { ledger: { orderBy: { createdAt: 'desc' } } },
    });
  }
}
