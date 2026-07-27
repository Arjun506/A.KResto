import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddProductMediaDto } from './add-media.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ProductMediaAddedEvent } from '../../event-bus/events/product.events';

@Injectable()
export class ProductMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async addMedia(productId: string, dto: AddProductMediaDto) {
    if (dto.isPrimary) {
      await this.prisma.product_media.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    const media = await this.prisma.product_media.create({
      data: {
        productId,
        variantId: dto.variantId,
        fileKey: dto.fileKey,
        fileName: dto.fileName,
        mimeType: dto.mimeType,
        type: dto.type,
        url: dto.url,
        isPrimary: dto.isPrimary ?? false,
        position: dto.position ?? 0,
      },
    });

    await this.eventBus.publish(
      new ProductMediaAddedEvent(productId, {
        productId,
        mediaId: media.id,
        type: dto.type,
      }),
    );

    return media;
  }

  async getMedia(productId: string) {
    return this.prisma.product_media.findMany({
      where: { productId, deletedAt: null },
      orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }],
    });
  }

  async softDeleteMedia(mediaId: string) {
    return this.prisma.product_media.update({
      where: { id: mediaId },
      data: { deletedAt: new Date() },
    });
  }
}
