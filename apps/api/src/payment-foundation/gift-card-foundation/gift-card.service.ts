import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  GiftCardIssuedEvent,
  GiftCardRedeemedEvent,
} from '../../event-bus/events/payment.events';

@Injectable()
export class GiftCardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async issueGiftCard(
    tenantId: string,
    cardNumber: string,
    initialBalance: number,
    pin?: string,
  ) {
    const existing = await this.prisma.gift_cards.findUnique({
      where: { cardNumber },
    });
    if (existing) {
      throw new BadRequestException(`Card number already exists`);
    }

    const card = await this.prisma.gift_cards.create({
      data: {
        tenantId,
        cardNumber,
        pinEncrypted: pin, // In production, hash the pin
        initialBalance,
        currentBalance: initialBalance,
      },
    });

    await this.eventBus.publish(
      new GiftCardIssuedEvent(
        card.id,
        { giftCardId: card.id, cardNumber, amount: initialBalance },
        tenantId,
      ),
    );

    return card;
  }

  async redeemGiftCard(cardNumber: string, amount: number, pin?: string) {
    const card = await this.prisma.gift_cards.findUnique({
      where: { cardNumber },
    });
    if (!card) {
      throw new NotFoundException(`Gift card ${cardNumber} not found`);
    }

    if (!card.isActive) {
      throw new BadRequestException(`Gift card is inactive`);
    }

    if (card.expiresAt && card.expiresAt < new Date()) {
      throw new BadRequestException(`Gift card has expired`);
    }

    if (card.pinEncrypted && card.pinEncrypted !== pin) {
      throw new BadRequestException(`Invalid PIN`);
    }

    if (card.currentBalance < amount) {
      throw new BadRequestException(`Insufficient card balance`);
    }

    const updated = await this.prisma.gift_cards.update({
      where: { id: card.id },
      data: { currentBalance: { decrement: amount } },
    });

    await this.eventBus.publish(
      new GiftCardRedeemedEvent(
        card.id,
        { giftCardId: card.id, amount, balance: updated.currentBalance },
        card.tenantId || undefined,
      ),
    );

    return updated;
  }

  async getGiftCard(cardNumber: string) {
    const card = await this.prisma.gift_cards.findUnique({
      where: { cardNumber },
    });
    if (!card) {
      throw new NotFoundException(`Gift card ${cardNumber} not found`);
    }
    return card;
  }
}
