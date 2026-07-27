import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateStockStatusDto } from './update-stock-status.dto';
import { StockStatus } from '@prisma/client';

@Injectable()
export class InventoryStatusService {
  constructor(private readonly prisma: PrismaService) {}

  async updateStockLevelStatus(
    inventoryItemId: string,
    warehouseId: string,
    dto: UpdateStockStatusDto,
  ) {
    return this.prisma.stock_levels.updateMany({
      where: { inventoryItemId, warehouseId },
      data: { status: dto.status },
    });
  }

  async getStockStatusDefinitions() {
    return Object.values(StockStatus).map((code) => ({ code, label: code }));
  }
}
