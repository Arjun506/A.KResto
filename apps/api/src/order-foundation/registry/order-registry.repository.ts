import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderRegistryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateOrderDto,
    subtotal: number,
    discountTotal: number,
    taxTotal: number,
    grandTotal: number,
  ) {
    return this.prisma.universal_orders.create({
      data: {
        tenantId: dto.tenantId,
        businessId: dto.businessId,
        customerId: dto.customerId,
        orderNumber: dto.orderNumber,
        type: dto.type || 'SALES_ORDER',
        status: 'DRAFT',
        channelCode: dto.channelCode || 'WEB',
        currency: dto.currency || 'USD',
        subtotal,
        discountTotal,
        taxTotal,
        grandTotal,
        fulfillmentType: dto.fulfillmentType || 'DELIVERY',
        fulfillmentWarehouseId: dto.fulfillmentWarehouseId,
        metadata: dto.metadata,
        items: {
          create: dto.lineItems.map((item) => {
            const disc = item.discountAmount || 0;
            const tax = item.taxAmount || 0;
            const tot = item.quantity * item.unitPrice - disc + tax;
            return {
              productId: item.productId,
              variantId: item.variantId,
              inventoryItemId: item.inventoryItemId,
              sku: item.sku,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discountAmount: disc,
              taxAmount: tax,
              totalPrice: tot,
            };
          }),
        },
      },
      include: {
        items: true,
        business: { select: { id: true, name: true } },
        customer: { select: { id: true, customerCode: true } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.universal_orders.findFirst({
      where: { id, deletedAt: null },
      include: {
        items: true,
        transactions: true,
        snapshots: true,
        versions: true,
        shipments: true,
        slas: true,
        notes: true,
        tags: true,
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.universal_orders.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'CANCELLED' },
    });
  }

  async list(tenantId?: string, page: number = 1, limit: number = 20) {
    const where = tenantId
      ? { tenantId, deletedAt: null }
      : { deletedAt: null };
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.universal_orders.findMany({
        where,
        skip,
        take: limit,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.universal_orders.count({ where }),
    ]);

    return { orders, total };
  }

  async recordTimeline(
    orderId: string,
    eventType: string,
    description: string,
    actorId?: string,
    metadata?: any,
  ) {
    return this.prisma.order_timeline.create({
      data: {
        orderId,
        eventType,
        description,
        actorId,
        metadata,
      },
    });
  }
}
