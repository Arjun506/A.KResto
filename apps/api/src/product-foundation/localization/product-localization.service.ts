import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProductTranslationDto } from './update-translation.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ProductLocalizedEvent } from '../../event-bus/events/product.events';

@Injectable()
export class ProductLocalizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async updateTranslation(productId: string, dto: UpdateProductTranslationDto) {
    const translation = await this.prisma.product_translations.upsert({
      where: {
        productId_locale: {
          productId,
          locale: dto.locale,
        },
      },
      create: {
        productId,
        locale: dto.locale,
        name: dto.name,
        description: dto.description,
        shortDescription: dto.shortDescription,
        seoTitle: dto.seoTitle,
        metaDescription: dto.metaDescription,
      },
      update: {
        name: dto.name,
        ...(dto.description && { description: dto.description }),
        ...(dto.shortDescription && { shortDescription: dto.shortDescription }),
        ...(dto.seoTitle && { seoTitle: dto.seoTitle }),
        ...(dto.metaDescription && { metaDescription: dto.metaDescription }),
      },
    });

    await this.eventBus.publish(
      new ProductLocalizedEvent(productId, { productId, locale: dto.locale }),
    );

    return translation;
  }

  async getTranslations(productId: string) {
    return this.prisma.product_translations.findMany({
      where: { productId },
    });
  }
}
