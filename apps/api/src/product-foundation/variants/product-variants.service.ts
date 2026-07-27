import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductVariantDto } from './create-variant.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ProductVariantCreatedEvent } from '../../event-bus/events/product.events';

@Injectable()
export class ProductVariantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createVariant(productId: string, dto: CreateProductVariantDto) {
    if (dto.isDefault) {
      await this.prisma.product_variants.updateMany({
        where: { productId },
        data: { isDefault: false },
      });
    }

    const variant = await this.prisma.product_variants.create({
      data: {
        productId,
        sku: dto.sku,
        barcode: dto.barcode,
        name: dto.name,
        optionCombination: dto.optionCombination,
        priceAdjustment: dto.priceAdjustment ?? 0,
        weight: dto.weight,
        isDefault: dto.isDefault ?? false,
      },
    });

    await this.eventBus.publish(
      new ProductVariantCreatedEvent(productId, {
        productId,
        variantId: variant.id,
        sku: dto.sku,
      }),
    );

    return variant;
  }

  async getVariants(productId: string) {
    return this.prisma.product_variants.findMany({
      where: { productId, deletedAt: null },
    });
  }

  async softDeleteVariant(variantId: string) {
    return this.prisma.product_variants.update({
      where: { id: variantId },
      data: { deletedAt: new Date() },
    });
  }
}
