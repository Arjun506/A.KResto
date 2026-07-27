import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdjustStockDto } from './adjust-stock.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { StockAdjustedEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class InventoryAdjustmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async adjustStock(dto: AdjustStockDto, actorId?: string) {
    const isAdd = dto.adjustmentQuantity > 0;
    const absQty = Math.abs(dto.adjustmentQuantity);

    const movement = await this.prisma.stock_movements.create({
      data: {
        inventoryItemId: dto.inventoryItemId,
        warehouseId: dto.warehouseId,
        type: isAdd ? 'ADJUSTMENT_ADD' : 'ADJUSTMENT_SUBTRACT',
        workflowStatus: 'POSTED',
        quantity: absQty,
        unitCost: 0,
        totalCost: 0,
        referenceNumber: dto.reasonCode,
        actorId,
        notes: dto.notes,
      },
    });

    const stockLevel = await this.prisma.stock_levels.findFirst({
      where: {
        inventoryItemId: dto.inventoryItemId,
        warehouseId: dto.warehouseId,
        status: 'AVAILABLE',
      },
    });

    if (stockLevel) {
      await this.prisma.stock_levels.update({
        where: { id: stockLevel.id },
        data: {
          quantityOnHand: { increment: dto.adjustmentQuantity },
          quantityAvailable: { increment: dto.adjustmentQuantity },
        },
      });
    }

    await this.eventBus.publish(
      new StockAdjustedEvent(dto.inventoryItemId, {
        inventoryItemId: dto.inventoryItemId,
        warehouseId: dto.warehouseId,
        adjustmentQuantity: dto.adjustmentQuantity,
      }),
    );

    return movement;
  }
}
