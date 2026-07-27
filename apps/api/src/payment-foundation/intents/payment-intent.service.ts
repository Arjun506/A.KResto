import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentIntentDto } from './dto/create-intent.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { PaymentIntentCreatedEvent } from '../../event-bus/events/payment.events';

@Injectable()
export class PaymentIntentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createIntent(dto: CreatePaymentIntentDto) {
    if (dto.idempotencyKey) {
      const existing = await this.prisma.payment_intents.findFirst({
        where: { idempotencyKey: dto.idempotencyKey },
      });
      if (existing) {
        return existing;
      }
    }

    const duplicateNumber = await this.prisma.payment_intents.findUnique({
      where: { intentNumber: dto.intentNumber },
    });
    if (duplicateNumber) {
      throw new ConflictException(
        `Intent with number ${dto.intentNumber} already exists`,
      );
    }

    // Set default expiration of 1 hour
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const intent = await this.prisma.payment_intents.create({
      data: {
        tenantId: dto.tenantId,
        orderId: dto.orderId,
        intentNumber: dto.intentNumber,
        amount: dto.amount,
        currency: dto.currency || 'USD',
        status: 'PENDING',
        idempotencyKey: dto.idempotencyKey,
        expiresAt,
      },
    });

    await this.eventBus.publish(
      new PaymentIntentCreatedEvent(
        intent.id,
        {
          intentId: intent.id,
          intentNumber: intent.intentNumber,
          amount: intent.amount,
        },
        intent.tenantId || undefined,
      ),
    );

    return intent;
  }

  async getIntent(id: string) {
    return this.prisma.payment_intents.findUnique({ where: { id } });
  }

  async expireIntent(id: string) {
    return this.prisma.payment_intents.update({
      where: { id },
      data: { status: 'EXPIRED' },
    });
  }
}
