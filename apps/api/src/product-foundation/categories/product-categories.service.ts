import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateProductCategoryDto,
  AssignProductCategoryDto,
} from './create-category.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ProductCategoryAssignedEvent } from '../../event-bus/events/product.events';

@Injectable()
export class ProductCategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createCategory(
    tenantId: string | undefined,
    dto: CreateProductCategoryDto,
  ) {
    return this.prisma.product_categories.create({
      data: {
        tenantId,
        parentId: dto.parentId,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        icon: dto.icon,
        position: dto.position ?? 0,
      },
    });
  }

  async getCategoryTree(tenantId?: string) {
    return this.prisma.product_categories.findMany({
      where: tenantId
        ? { tenantId, parentId: null, deletedAt: null }
        : { parentId: null, deletedAt: null },
      include: {
        children: {
          include: { children: true },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  async assignCategory(productId: string, dto: AssignProductCategoryDto) {
    const mapping = await this.prisma.product_category_mappings.upsert({
      where: {
        productId_categoryId: {
          productId,
          categoryId: dto.categoryId,
        },
      },
      create: { productId, categoryId: dto.categoryId },
      update: {},
    });

    await this.eventBus.publish(
      new ProductCategoryAssignedEvent(productId, {
        productId,
        categoryId: dto.categoryId,
      }),
    );

    return mapping;
  }
}
