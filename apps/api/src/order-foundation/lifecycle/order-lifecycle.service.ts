import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOrderStatusDto } from './update-order-status.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  OrderSubmittedEvent,
  OrderConfirmedEvent,
  OrderCompletedEvent,
} from '../../event-bus/events/order.events';

@Injectable()
export class OrderLifecycleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async updateOrderStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    actorId?: string,
  ) {
    const order = await this.prisma.universal_orders.findFirst({
      where: { id, deletedAt: null },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const updated = await this.prisma.universal_orders.update({
      where: { id },
      data: { status: dto.status },
    });

    await this.prisma.order_timeline.create({
      data: {
        orderId: id,
        eventType: 'STATUS_CHANGED',
        description: `Order status transitioned from ${order.status} to ${dto.status}`,
        actorId,
      },
    });

    if (dto.status === 'SUBMITTED') {
      await this.eventBus.publish(
        new OrderSubmittedEvent(
          id,
          { orderId: id, orderNumber: order.orderNumber },
          order.tenantId || undefined,
        ),
      );
    } else if (dto.status === 'CONFIRMED') {
      await this.eventBus.publish(
        new OrderConfirmedEvent(
          id,
          { orderId: id },
          order.tenantId || undefined,
        ),
      );
    } else if (dto.status === 'COMPLETED') {
      await this.eventBus.publish(
        new OrderCompletedEvent(
          id,
          { orderId: id },
          order.tenantId || undefined,
        ),
      );
    }

    return updated;
  }
}
