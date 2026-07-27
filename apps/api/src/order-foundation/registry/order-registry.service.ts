import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRegistryRepository } from './order-registry.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';
import { OrderCreatedEvent } from '../../event-bus/events/order.events';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderRegistryService {
  constructor(
    private readonly repo: OrderRegistryRepository,
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
    private readonly auditService: AuditService,
  ) {}

  async createOrder(dto: CreateOrderDto, actorId?: string) {
    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    for (const item of dto.lineItems) {
      const disc = item.discountAmount || 0;
      const tax = item.taxAmount || 0;
      subtotal += item.quantity * item.unitPrice;
      discountTotal += disc;
      taxTotal += tax;
    }

    const grandTotal = subtotal - discountTotal + taxTotal;

    const order = await this.repo.create(
      dto,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
    );

    // Create calculation snapshot
    await this.prisma.order_calculation_snapshots.create({
      data: {
        orderId: order.id,
        subtotal,
        discountTotal,
        taxTotal,
        grandTotal,
        currency: order.currency,
        breakdownSnapshot: JSON.parse(JSON.stringify(order.items)),
      },
    });

    await this.repo.recordTimeline(
      order.id,
      'ORDER_CREATED',
      `Order ${order.orderNumber} created with grand total ${order.grandTotal} ${order.currency}`,
      actorId,
    );

    await this.eventBus.publish(
      new OrderCreatedEvent(
        order.id,
        {
          orderId: order.id,
          orderNumber: order.orderNumber,
          grandTotal: order.grandTotal,
        },
        order.tenantId || undefined,
      ),
    );

    await this.auditService.logEvent({
      tenantId: order.tenantId || 'GLOBAL',
      userId: actorId,
      entity: 'UNIVERSAL_ORDER',
      entityId: order.id,
      action: 'CREATE',
      changes: [`Created order ${order.orderNumber}`],
    });

    return order;
  }

  async getOrderById(id: string) {
    const order = await this.repo.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async listOrders(tenantId?: string, page: number = 1, limit: number = 20) {
    const { orders, total } = await this.repo.list(tenantId, page, limit);
    return {
      orders,
      totalOrders: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async softDeleteOrder(id: string, actorId?: string) {
    const order = await this.getOrderById(id);
    await this.repo.softDelete(id);

    await this.repo.recordTimeline(
      id,
      'ORDER_DELETED',
      `Order ${order.orderNumber} soft deleted`,
      actorId,
    );

    return { success: true, message: `Order ${id} soft deleted` };
  }
}
