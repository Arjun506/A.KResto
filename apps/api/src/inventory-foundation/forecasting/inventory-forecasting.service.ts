import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ForecastGeneratedEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class InventoryForecastingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async generateForecast(
    inventoryItemId: string,
    forecastPeriod: string = '30_DAYS',
  ) {
    const item = await this.prisma.inventory_master_items.findFirst({
      where: { id: inventoryItemId },
    });

    const predictedDemand = (item?.reorderQuantity || 50) * 1.2;
    const recommendedSafetyStock = Math.ceil((item?.safetyStock || 5) * 1.5);
    const suggestedReorderQty = Math.ceil(
      predictedDemand + recommendedSafetyStock,
    );

    const forecast = await this.prisma.inventory_forecasts.create({
      data: {
        inventoryItemId,
        forecastPeriod,
        predictedDemand,
        recommendedSafetyStock,
        suggestedReorderQty,
      },
    });

    await this.eventBus.publish(
      new ForecastGeneratedEvent(inventoryItemId, {
        inventoryItemId,
        predictedDemand,
      }),
    );

    return forecast;
  }

  async getLatestForecast(inventoryItemId: string) {
    return this.prisma.inventory_forecasts.findFirst({
      where: { inventoryItemId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
