import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductRelationshipDto } from './create-relationship.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ProductRelationshipCreatedEvent } from '../../event-bus/events/product.events';

@Injectable()
export class ProductRelationshipsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createRelationship(
    sourceProductId: string,
    dto: CreateProductRelationshipDto,
  ) {
    const rel = await this.prisma.product_relationships.create({
      data: {
        sourceProductId,
        targetProductId: dto.targetProductId,
        type: dto.type,
        position: dto.position ?? 0,
      },
    });

    await this.eventBus.publish(
      new ProductRelationshipCreatedEvent(sourceProductId, {
        sourceProductId,
        targetProductId: dto.targetProductId,
        type: dto.type,
      }),
    );

    return rel;
  }

  async getRelationships(productId: string) {
    return this.prisma.product_relationships.findMany({
      where: {
        OR: [{ sourceProductId: productId }, { targetProductId: productId }],
      },
      include: {
        sourceProduct: { select: { id: true, sku: true, name: true } },
        targetProduct: { select: { id: true, sku: true, name: true } },
      },
    });
  }

  async removeRelationship(id: string) {
    return this.prisma.product_relationships.delete({
      where: { id },
    });
  }
}
