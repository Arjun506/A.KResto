import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AllocateStockDto } from './create-allocation.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { StockAllocatedEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class InventoryAllocationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async allocateStock(dto: AllocateStockDto) {
    const stockLevel = await this.prisma.stock_levels.findFirst({
      where: {
        inventoryItemId: dto.inventoryItemId,
        warehouseId: dto.warehouseId,
        status: 'AVAILABLE',
      },
    });

    if (!stockLevel || stockLevel.quantityAvailable < dto.quantity) {
      throw new BadRequestException(
        'Insufficient available stock for allocation',
      );
    }

    const updated = await this.prisma.stock_levels.update({
      where: { id: stockLevel.id },
      data: {
        quantityAvailable: { decrement: dto.quantity },
        quantityReserved: { increment: dto.quantity },
      },
    });

    await this.eventBus.publish(
      new StockAllocatedEvent(dto.inventoryItemId, {
        inventoryItemId: dto.inventoryItemId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
      }),
    );

    return updated;
  }
}
