import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { RoutingCompletedEvent } from '../../event-bus/events/order.events';

@Injectable()
export class SmartRoutingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async routeOrderToFulfillmentNode(orderId: string) {
    const order = await this.prisma.universal_orders.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Evaluate active routing rules
    const rules = await this.prisma.smart_routing_rules.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' },
    });

    let assignedWarehouseId = rules[0]?.targetWarehouseId;

    if (!assignedWarehouseId) {
      const defaultWh = await this.prisma.warehouses.findFirst({
        where: { isActive: true, deletedAt: null },
      });
      assignedWarehouseId = defaultWh?.id || 'DEFAULT_WH';
    }

    const updated = await this.prisma.universal_orders.update({
      where: { id: orderId },
      data: { fulfillmentWarehouseId: assignedWarehouseId },
    });

    await this.eventBus.publish(
      new RoutingCompletedEvent(orderId, {
        orderId,
        targetWarehouseId: assignedWarehouseId,
      }),
    );

    return updated;
  }
}
