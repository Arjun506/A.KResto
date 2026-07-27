import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PricingAuditSnapshotService {
  constructor(private readonly prisma: PrismaService) {}

  async createSnapshot(
    priceBookId: string | undefined,
    productId: string | undefined,
    actionType: string,
    beforeState: any,
    afterState: any,
    actorId?: string,
  ) {
    return this.prisma.price_audit_snapshots.create({
      data: {
        priceBookId,
        productId,
        actionType,
        beforeState: JSON.parse(JSON.stringify(beforeState)),
        afterState: JSON.parse(JSON.stringify(afterState)),
        actorId,
      },
    });
  }

  async getSnapshots(priceBookId?: string, productId?: string) {
    const where: any = {};
    if (priceBookId) where.priceBookId = priceBookId;
    if (productId) where.productId = productId;

    return this.prisma.price_audit_snapshots.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
