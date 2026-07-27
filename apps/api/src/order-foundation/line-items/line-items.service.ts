import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddLineItemDto } from './add-line-item.dto';

@Injectable()
export class LineItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async addLineItem(orderId: string, dto: AddLineItemDto) {
    const order = await this.prisma.universal_orders.findFirst({
      where: { id: orderId, deletedAt: null },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const disc = dto.discountAmount || 0;
    const tax = dto.taxAmount || 0;
    const itemTotal = dto.quantity * dto.unitPrice - disc + tax;

    const lineItem = await this.prisma.universal_order_items.create({
      data: {
        orderId,
        productId: dto.productId,
        variantId: dto.variantId,
        inventoryItemId: dto.inventoryItemId,
        sku: dto.sku,
        name: dto.name,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        discountAmount: disc,
        taxAmount: tax,
        totalPrice: itemTotal,
      },
    });

    // Recalculate order totals
    const newSubtotal = order.subtotal + dto.quantity * dto.unitPrice;
    const newDiscount = order.discountTotal + disc;
    const newTax = order.taxTotal + tax;
    const newGrandTotal = newSubtotal - newDiscount + newTax;

    await this.prisma.universal_orders.update({
      where: { id: orderId },
      data: {
        subtotal: newSubtotal,
        discountTotal: newDiscount,
        taxTotal: newTax,
        grandTotal: newGrandTotal,
      },
    });

    return lineItem;
  }
}
