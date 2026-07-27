import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentTransactionDto } from './dto/create-payment.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { PaymentCreatedEvent } from '../../event-bus/events/payment.events';

@Injectable()
export class PaymentRegistryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createPayment(dto: CreatePaymentTransactionDto) {
    const existing = await this.prisma.payment_transactions.findUnique({
      where: { paymentNumber: dto.paymentNumber },
    });
    if (existing) {
      throw new ConflictException(
        `Payment number ${dto.paymentNumber} already registered`,
      );
    }

    const payment = await this.prisma.payment_transactions.create({
      data: {
        tenantId: dto.tenantId,
        orderId: dto.orderId,
        businessId: dto.businessId,
        customerId: dto.customerId,
        paymentNumber: dto.paymentNumber,
        methodType: dto.methodType,
        providerId: dto.providerId,
        gatewayName: dto.gatewayName,
        status: 'PENDING',
        currency: dto.currency || 'USD',
        amount: dto.amount,
        metadata: dto.metadata,
      },
    });

    await this.eventBus.publish(
      new PaymentCreatedEvent(
        payment.id,
        {
          paymentId: payment.id,
          paymentNumber: payment.paymentNumber,
          amount: payment.amount,
        },
        payment.tenantId || undefined,
      ),
    );

    return payment;
  }

  async getPayment(id: string) {
    return this.prisma.payment_transactions.findUnique({
      where: { id },
      include: { refunds: true, splits: true, disputes: true },
    });
  }

  async getPaymentsByOrder(orderId: string) {
    return this.prisma.payment_transactions.findMany({
      where: { orderId, deletedAt: null },
    });
  }
}
