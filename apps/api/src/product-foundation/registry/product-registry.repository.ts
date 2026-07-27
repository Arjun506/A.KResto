import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductRegistryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto, creatorId?: string) {
    return this.prisma.products.create({
      data: {
        tenantId: dto.tenantId,
        businessId: dto.businessId,
        sku: dto.sku,
        barcode: dto.barcode,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        shortDescription: dto.shortDescription,
        identityType: dto.identityType || 'PHYSICAL',
        lifecycleStage: dto.lifecycleStage || 'ACTIVE',
        status: ProductStatus.DRAFT,
        publishingStatus: 'DRAFT',
        brand: dto.brand,
        isTaxable: dto.isTaxable ?? true,
        trackInventory: dto.trackInventory ?? false,
        isBatchManaged: dto.isBatchManaged ?? false,
        isSerialized: dto.isSerialized ?? false,
        isExpiryManaged: dto.isExpiryManaged ?? false,
        isStockManaged: dto.isStockManaged ?? false,
        seoTitle: dto.seoTitle,
        metaDescription: dto.metaDescription,
        metadata: dto.metadata,
        createdBy: creatorId,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.products.findFirst({
      where: { id, deletedAt: null },
      include: {
        versions: { orderBy: { versionNumber: 'desc' }, take: 5 },
        translations: true,
        categoryMappings: { include: { category: true } },
        variants: { where: { deletedAt: null } },
        prices: true,
        media: { where: { deletedAt: null } },
        tagMappings: { include: { tag: true } },
      },
    });
  }

  async updateStatus(id: string, status: ProductStatus, updaterId?: string) {
    return this.prisma.products.update({
      where: { id },
      data: { status, updatedBy: updaterId },
    });
  }

  async softDelete(id: string, deleterId?: string) {
    return this.prisma.products.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: ProductStatus.DELETED,
        publishingStatus: 'ARCHIVED',
        updatedBy: deleterId,
      },
    });
  }

  async list(tenantId?: string, page: number = 1, limit: number = 20) {
    const where = tenantId
      ? { tenantId, deletedAt: null }
      : { deletedAt: null };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.products.findMany({
        where,
        skip,
        take: limit,
        include: {
          prices: { where: { priceType: 'BASE' }, take: 1 },
          media: { where: { isPrimary: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.products.count({ where }),
    ]);

    return { items, total };
  }

  async recordTimeline(
    productId: string,
    eventType: string,
    description: string,
    actorId?: string,
    metadata?: any,
  ) {
    return this.prisma.product_timeline.create({
      data: {
        productId,
        eventType,
        description,
        actorId,
        metadata,
      },
    });
  }
}
