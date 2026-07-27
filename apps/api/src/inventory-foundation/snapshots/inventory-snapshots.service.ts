import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { InventorySnapshotCreatedEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class InventorySnapshotsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createSnapshot(warehouseId?: string, inventoryItemId?: string) {
    const stockLevels = await this.prisma.stock_levels.findMany({
      where: {
        ...(warehouseId && { warehouseId }),
        ...(inventoryItemId && { inventoryItemId }),
      },
    });

    const totalQuantity = stockLevels.reduce(
      (acc, curr) => acc + curr.quantityOnHand,
      0,
    );
    const totalValuation = totalQuantity * 25.0; // Valuation baseline

    const snapshot = await this.prisma.inventory_snapshots.create({
      data: {
        warehouseId,
        inventoryItemId,
        totalQuantity,
        totalValuation,
        snapshotData: JSON.parse(JSON.stringify(stockLevels)),
      },
    });

    await this.eventBus.publish(
      new InventorySnapshotCreatedEvent(snapshot.id, {
        snapshotId: snapshot.id,
        totalQuantity,
        totalValuation,
      }),
    );

    return snapshot;
  }

  async getSnapshots(warehouseId?: string) {
    return this.prisma.inventory_snapshots.findMany({
      where: warehouseId ? { warehouseId } : {},
      orderBy: { snapshotDate: 'desc' },
    });
  }
}
