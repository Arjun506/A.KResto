import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryVersioningService {
  constructor(private readonly prisma: PrismaService) {}

  async createVersion(
    inventoryItemId?: string,
    warehouseId?: string,
    actorId?: string,
  ) {
    let targetObj: any = null;
    if (inventoryItemId) {
      targetObj = await this.prisma.inventory_master_items.findFirst({
        where: { id: inventoryItemId },
      });
    } else if (warehouseId) {
      targetObj = await this.prisma.warehouses.findFirst({
        where: { id: warehouseId },
      });
    }

    if (!targetObj) {
      throw new NotFoundException(
        'Target entity for inventory versioning not found',
      );
    }

    const latest = await this.prisma.inventory_versions.findFirst({
      where: {
        ...(inventoryItemId && { inventoryItemId }),
        ...(warehouseId && { warehouseId }),
      },
      orderBy: { versionNumber: 'desc' },
    });

    const nextVer = (latest?.versionNumber || 0) + 1;

    return this.prisma.inventory_versions.create({
      data: {
        inventoryItemId,
        warehouseId,
        versionNumber: nextVer,
        snapshot: JSON.parse(JSON.stringify(targetObj)),
        status: 'PUBLISHED',
        createdBy: actorId,
      },
    });
  }

  async getVersions(inventoryItemId?: string, warehouseId?: string) {
    return this.prisma.inventory_versions.findMany({
      where: {
        ...(inventoryItemId && { inventoryItemId }),
        ...(warehouseId && { warehouseId }),
      },
      orderBy: { versionNumber: 'desc' },
    });
  }
}
