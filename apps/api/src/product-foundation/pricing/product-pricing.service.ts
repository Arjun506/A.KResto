import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SetProductPriceDto } from './set-price.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ProductPriceChangedEvent } from '../../event-bus/events/product.events';

@Injectable()
export class ProductPricingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async setPrice(productId: string, dto: SetProductPriceDto) {
    const price = await this.prisma.product_prices.create({
      data: {
        productId,
        variantId: dto.variantId,
        priceType: dto.priceType,
        currency: dto.currency,
        amount: dto.amount,
        minQuantity: dto.minQuantity ?? 1,
        targetCustomerId: dto.targetCustomerId,
        targetBusinessId: dto.targetBusinessId,
        regionCode: dto.regionCode,
        channelCode: dto.channelCode,
      },
    });

    await this.eventBus.publish(
      new ProductPriceChangedEvent(productId, {
        productId,
        priceType: dto.priceType,
        amount: dto.amount,
        currency: dto.currency,
      }),
    );

    return price;
  }

  async getPrices(productId: string) {
    return this.prisma.product_prices.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
