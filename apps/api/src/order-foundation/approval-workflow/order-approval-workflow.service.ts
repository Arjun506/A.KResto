import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  OrderApprovedEvent,
  OrderRejectedEvent,
} from '../../event-bus/events/order.events';

@Injectable()
export class OrderApprovalWorkflowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async approveOrder(orderId: string, actorId?: string) {
    const order = await this.prisma.universal_orders.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const updated = await this.prisma.universal_orders.update({
      where: { id: orderId },
      data: { status: 'APPROVED' },
    });

    await this.eventBus.publish(
      new OrderApprovedEvent(orderId, { orderId, approvedBy: actorId }),
    );

    return updated;
  }

  async rejectOrder(orderId: string, reason?: string, actorId?: string) {
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

    await this.eventBus.publish(
      new OrderRejectedEvent(orderId, { orderId, reason }),
    );

    return updated;
  }
}
