import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderVersioningService {
  constructor(private readonly prisma: PrismaService) {}

  async createVersion(orderId: string, actorId?: string) {
    const order = await this.prisma.universal_orders.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const latest = await this.prisma.order_versions.findFirst({
      where: { orderId },
      orderBy: { versionNumber: 'desc' },
    });

    const nextVer = (latest?.versionNumber || 0) + 1;

    return this.prisma.order_versions.create({
      data: {
        orderId,
        versionNumber: nextVer,
        snapshot: JSON.parse(JSON.stringify(order)),
        status: 'PUBLISHED',
        createdBy: actorId,
      },
    });
  }

  async getVersions(orderId: string) {
    return this.prisma.order_versions.findMany({
      where: { orderId },
      orderBy: { versionNumber: 'desc' },
    });
  }
}
