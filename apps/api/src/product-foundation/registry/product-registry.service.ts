import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRegistryRepository } from './product-registry.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus } from '@prisma/client';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';
import {
  ProductCreatedEvent,
  ProductStatusChangedEvent,
  ProductArchivedEvent,
  ProductActivatedEvent,
  ProductDeletedEvent,
} from '../../event-bus/events/product.events';

@Injectable()
export class ProductRegistryService {
  constructor(
    private readonly repo: ProductRegistryRepository,
    private readonly eventBus: EventBusService,
    private readonly auditService: AuditService,
  ) {}

  async createProduct(dto: CreateProductDto, actorId?: string) {
    const product = await this.repo.create(dto, actorId);

    await this.repo.recordTimeline(
      product.id,
      'PRODUCT_CREATED',
      `Product ${product.name} (${product.sku}) created`,
      actorId,
    );

    await this.eventBus.publish(
      new ProductCreatedEvent(
        product.id,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          identityType: product.identityType,
        },
        product.tenantId || undefined,
      ),
    );

    await this.auditService.logEvent({
      tenantId: product.tenantId || 'GLOBAL',
      userId: actorId,
      entity: 'PRODUCT',
      entityId: product.id,
      action: 'CREATE',
      changes: [`Created product ${product.name} (${product.sku})`],
    });

    return product;
  }

  async getProductById(id: string) {
    const product = await this.repo.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateStatus(id: string, newStatus: ProductStatus, actorId?: string) {
    const product = await this.getProductById(id);
    const previousStatus = product.status;

    const updated = await this.repo.updateStatus(id, newStatus, actorId);

    await this.repo.recordTimeline(
      id,
      'STATUS_CHANGED',
      `Status changed from ${previousStatus} to ${newStatus}`,
      actorId,
    );

    if (newStatus === ProductStatus.ACTIVE) {
      await this.eventBus.publish(
        new ProductActivatedEvent(
          id,
          { productId: id },
          updated.tenantId || undefined,
        ),
      );
    } else if (newStatus === ProductStatus.ARCHIVED) {
      await this.eventBus.publish(
        new ProductArchivedEvent(
          id,
          { productId: id },
          updated.tenantId || undefined,
        ),
      );
    }

    return updated;
  }

  async softDeleteProduct(id: string, actorId?: string) {
    const product = await this.getProductById(id);
    await this.repo.softDelete(id, actorId);

    await this.repo.recordTimeline(
      id,
      'PRODUCT_DELETED',
      `Product ${product.sku} soft deleted`,
      actorId,
    );

    await this.eventBus.publish(
      new ProductDeletedEvent(
        id,
        { productId: id },
        product.tenantId || undefined,
      ),
    );

    return { success: true, message: `Product ${id} soft deleted` };
  }

  async listProducts(tenantId?: string, page: number = 1, limit: number = 20) {
    const { items, total } = await this.repo.list(tenantId, page, limit);
    return {
      items,
      totalItems: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}
