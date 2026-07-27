import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SetReorderRuleDto } from './set-reorder-rule.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ReorderTriggeredEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class ReorderRulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async setReorderRule(dto: SetReorderRuleDto) {
    const updated = await this.prisma.inventory_master_items.update({
      where: { id: dto.inventoryItemId },
      data: {
        reorderPoint: dto.reorderPoint,
        reorderQuantity: dto.reorderQuantity,
        safetyStock: dto.safetyStock,
      },
    });

    const stockLevels = await this.prisma.stock_levels.aggregate({
      where: { inventoryItemId: dto.inventoryItemId },
      _sum: { quantityAvailable: true },
    });

    const totalAvailable = stockLevels._sum.quantityAvailable || 0;

    if (totalAvailable <= dto.reorderPoint) {
      await this.eventBus.publish(
        new ReorderTriggeredEvent(dto.inventoryItemId, {
          inventoryItemId: dto.inventoryItemId,
          currentQuantity: totalAvailable,
          reorderQuantity: dto.reorderQuantity,
        }),
      );
    }

    return updated;
  }
}
