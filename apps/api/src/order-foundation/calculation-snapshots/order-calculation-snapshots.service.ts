import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { OrderSnapshotCreatedEvent } from '../../event-bus/events/order.events';

@Injectable()
export class OrderCalculationSnapshotsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createSnapshot(orderId: string) {
    const order = await this.prisma.universal_orders.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const snapshot = await this.prisma.order_calculation_snapshots.create({
      data: {
        orderId,
        subtotal: order.subtotal,
        discountTotal: order.discountTotal,
        taxTotal: order.taxTotal,
        grandTotal: order.grandTotal,
        currency: order.currency,
        breakdownSnapshot: JSON.parse(JSON.stringify(order.items)),
      },
    });

    await this.eventBus.publish(
      new OrderSnapshotCreatedEvent(snapshot.id, {
        snapshotId: snapshot.id,
        orderId,
      }),
    );

    return snapshot;
  }

  async getSnapshots(orderId: string) {
    return this.prisma.order_calculation_snapshots.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
