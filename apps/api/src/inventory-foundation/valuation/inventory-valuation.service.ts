import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { InventoryValuationUpdatedEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class InventoryValuationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async calculateItemValuation(inventoryItemId: string) {
    const item = await this.prisma.inventory_master_items.findFirst({
      where: { id: inventoryItemId },
    });

    const movements = await this.prisma.stock_movements.findMany({
      where: { inventoryItemId, type: 'RECEIPT' },
    });

    const totalQty = movements.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalCost = movements.reduce((acc, curr) => acc + curr.totalCost, 0);

    const averageUnitCost = totalQty > 0 ? totalCost / totalQty : 0;

    const currentStock = await this.prisma.stock_levels.aggregate({
      where: { inventoryItemId },
      _sum: { quantityOnHand: true },
    });

    const totalOnHand = currentStock._sum.quantityOnHand || 0;
    const totalValuation = totalOnHand * averageUnitCost;

    await this.eventBus.publish(
      new InventoryValuationUpdatedEvent(inventoryItemId, {
        inventoryItemId,
        newValuation: totalValuation,
      }),
    );

    return {
      inventoryItemId,
      valuationMethod: item?.valuationMethod || 'AVCO',
      totalOnHand,
      averageUnitCost,
      totalValuation,
    };
  }
}
