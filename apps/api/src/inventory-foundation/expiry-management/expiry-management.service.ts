import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExpiryManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async getExpiringBatches(daysThreshold: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + Number(daysThreshold));

    return this.prisma.inventory_batches.findMany({
      where: {
        expiresAt: {
          lte: cutoffDate,
          gte: new Date(),
        },
      },
      include: {
        inventoryItem: { select: { id: true, sku: true, name: true } },
      },
      orderBy: { expiresAt: 'asc' },
    });
  }
}
