import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePriceBookDto } from './dto/create-price-book.dto';
import { PriceBookStatus, PricingWorkflowStatus } from '@prisma/client';

@Injectable()
export class PriceBooksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePriceBookDto) {
    if (dto.isDefault) {
      await this.prisma.price_books.updateMany({
        where: dto.tenantId ? { tenantId: dto.tenantId } : {},
        data: { isDefault: false },
      });
    }

    return this.prisma.price_books.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        isDefault: dto.isDefault ?? false,
        status: PriceBookStatus.ACTIVE,
        workflowStatus: PricingWorkflowStatus.DRAFT,
        strategyType: dto.strategyType || 'FIXED_PRICE',
        metadata: dto.metadata,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.price_books.findFirst({
      where: { id, deletedAt: null },
      include: {
        priceLists: true,
        versions: { orderBy: { versionNumber: 'desc' }, take: 5 },
        auditSnapshots: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.price_books.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: PriceBookStatus.ARCHIVED,
      },
    });
  }

  async list(tenantId?: string, page: number = 1, limit: number = 20) {
    const where = tenantId
      ? { tenantId, deletedAt: null }
      : { deletedAt: null };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.price_books.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.price_books.count({ where }),
    ]);

    return { items, total };
  }

  async recordTimeline(
    priceBookId: string,
    eventType: string,
    description: string,
    actorId?: string,
    metadata?: any,
  ) {
    return this.prisma.pricing_timeline.create({
      data: {
        priceBookId,
        eventType,
        description,
        actorId,
        metadata,
      },
    });
  }
}
