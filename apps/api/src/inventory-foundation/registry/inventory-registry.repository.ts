import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';

@Injectable()
export class InventoryRegistryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInventoryItemDto) {
    return this.prisma.inventory_master_items.create({
      data: {
        tenantId: dto.tenantId,
        productId: dto.productId,
        variantId: dto.variantId,
        sku: dto.sku,
        name: dto.name,
        valuationMethod: dto.valuationMethod || 'AVCO',
        purchaseUomId: dto.purchaseUomId,
        storageUomId: dto.storageUomId,
        salesUomId: dto.salesUomId,
        reportingUomId: dto.reportingUomId,
        purchaseToStorageFactor: dto.purchaseToStorageFactor ?? 1,
        salesToStorageFactor: dto.salesToStorageFactor ?? 1,
        reorderPoint: dto.reorderPoint ?? 10,
        reorderQuantity: dto.reorderQuantity ?? 50,
        safetyStock: dto.safetyStock ?? 5,
        metadata: dto.metadata,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.inventory_master_items.findFirst({
      where: { id, deletedAt: null },
      include: {
        stockLevels: { include: { warehouse: true, location: true } },
        batches: true,
        serials: true,
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.inventory_master_items.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async list(tenantId?: string, page: number = 1, limit: number = 20) {
    const where = tenantId
      ? { tenantId, deletedAt: null }
      : { deletedAt: null };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.inventory_master_items.findMany({
        where,
        skip,
        take: limit,
        include: {
          stockLevels: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inventory_master_items.count({ where }),
    ]);

    return { items, total };
  }

  async recordTimeline(
    inventoryItemId: string,
    eventType: string,
    description: string,
    actorId?: string,
    metadata?: any,
  ) {
    return this.prisma.inventory_timeline.create({
      data: {
        inventoryItemId,
        eventType,
        description,
        actorId,
        metadata,
      },
    });
  }
}
