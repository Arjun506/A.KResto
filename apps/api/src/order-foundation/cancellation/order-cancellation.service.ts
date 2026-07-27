import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CancelOrderDto } from './cancel-order.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { OrderCancelledEvent } from '../../event-bus/events/order.events';

@Injectable()
export class OrderCancellationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async cancelOrder(orderId: string, dto: CancelOrderDto, actorId?: string) {
    const order = await this.prisma.universal_orders.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const updated = await this.prisma.universal_orders.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    await this.prisma.order_timeline.create({
      data: {
        orderId,
        eventType: 'ORDER_CANCELLED',
        description: `Order cancelled due to ${dto.reasonCode}`,
        actorId,
      },
    });

    await this.eventBus.publish(
      new OrderCancelledEvent(
        orderId,
        { orderId, reasonCode: dto.reasonCode },
        order.tenantId || undefined,
      ),
    );

    return updated;
  }
}
