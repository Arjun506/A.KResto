import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePublishingStatusDto } from './update-publishing-status.dto';
import { PublishingStatus } from '@prisma/client';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  ProductPublishedEvent,
  ProductVisibilityChangedEvent,
} from '../../event-bus/events/product.events';

@Injectable()
export class ProductPublishingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async updatePublishingStatus(
    productId: string,
    dto: UpdatePublishingStatusDto,
    actorId?: string,
  ) {
    const product = await this.prisma.products.findFirst({
      where: { id: productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const updated = await this.prisma.products.update({
      where: { id: productId },
      data: {
        publishingStatus: dto.publishingStatus,
        updatedBy: actorId,
      },
    });

    await this.eventBus.publish(
      new ProductVisibilityChangedEvent(productId, {
        productId,
        publishingStatus: dto.publishingStatus,
      }),
    );

    if (dto.publishingStatus === PublishingStatus.PUBLISHED) {
      await this.eventBus.publish(
        new ProductPublishedEvent(productId, { productId, versionNumber: 1 }),
      );
    }

    return updated;
  }
}
