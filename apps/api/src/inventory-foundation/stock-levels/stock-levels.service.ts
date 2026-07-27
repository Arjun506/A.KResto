import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StockLevelsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStockLevels(inventoryItemId?: string, warehouseId?: string) {
    const where: any = {};
    if (inventoryItemId) where.inventoryItemId = inventoryItemId;
    if (warehouseId) where.warehouseId = warehouseId;

    return this.prisma.stock_levels.findMany({
      where,
      include: {
        inventoryItem: { select: { id: true, sku: true, name: true } },
        warehouse: { select: { id: true, code: true, name: true } },
        location: { select: { id: true, code: true, name: true } },
      },
    });
  }
}
