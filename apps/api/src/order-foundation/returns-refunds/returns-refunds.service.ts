import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReturnAuthDto } from './create-return.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  ReturnAuthorizedEvent,
  RefundRequestedEvent,
} from '../../event-bus/events/order.events';

@Injectable()
export class ReturnsRefundsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async authorizeReturn(orderId: string, dto: CreateReturnAuthDto) {
    const rma = await this.prisma.return_authorizations.create({
      data: {
        orderId,
        rmaNumber: dto.rmaNumber,
        reasonCode: dto.reasonCode,
        status: 'AUTHORIZED',
        notes: dto.notes,
      },
    });

    const refund = await this.prisma.refund_requests.create({
      data: {
        returnAuthId: rma.id,
        orderId,
        refundAmount: dto.refundAmount,
        status: 'PENDING',
        notes: dto.notes,
      },
    });

    await this.eventBus.publish(
      new ReturnAuthorizedEvent(rma.id, { rmaNumber: rma.rmaNumber, orderId }),
    );

    await this.eventBus.publish(
      new RefundRequestedEvent(refund.id, {
        refundId: refund.id,
        orderId,
        amount: dto.refundAmount,
      }),
    );

    return { rma, refund };
  }

  async getReturns(orderId: string) {
    return this.prisma.return_authorizations.findMany({
      where: { orderId },
      include: { returnedGoods: true, refunds: true },
    });
  }
}
