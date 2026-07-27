import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { PriceCalculatedEvent } from '../../event-bus/events/pricing.events';
import { CalculatePriceQueryDto } from './calculate-price-query.dto';

@Injectable()
export class PriceCalculationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async calculatePrice(query: CalculatePriceQueryDto) {
    const qty = query.quantity ? Number(query.quantity) : 1;
    const currency = query.currency || 'USD';

    const product = await this.prisma.products.findFirst({
      where: { id: query.productId, deletedAt: null },
      include: { prices: true },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${query.productId} not found`,
      );
    }

    let calculatedPrice =
      product.prices.find((p) => p.priceType === 'BASE')?.amount || 0;
    let appliedRule = 'BASE_PRICE';

    // 1. Customer Override Precedence
    if (query.customerId) {
      const custPrice = await this.prisma.customer_prices.findFirst({
        where: { customerId: query.customerId, productId: query.productId },
      });
      if (custPrice) {
        calculatedPrice = custPrice.customPrice;
        appliedRule = 'CUSTOMER_OVERRIDE';
      }
    }

    // 2. Business Contract Precedence
    if (appliedRule === 'BASE_PRICE' && query.businessId) {
      const bizPrice = await this.prisma.business_prices.findFirst({
        where: { businessId: query.businessId, productId: query.productId },
      });
      if (bizPrice) {
        calculatedPrice = bizPrice.contractPrice;
        appliedRule = 'BUSINESS_CONTRACT';
      }
    }

    // 3. Tier Quantity Break Precedence
    if (appliedRule === 'BASE_PRICE') {
      const tier = await this.prisma.tier_prices.findFirst({
        where: {
          productId: query.productId,
          minQuantity: { lte: qty },
          OR: [{ maxQuantity: null }, { maxQuantity: { gte: qty } }],
        },
        orderBy: { minQuantity: 'desc' },
      });

      if (tier) {
        calculatedPrice = tier.price;
        appliedRule = 'TIER_QUANTITY_BREAK';
      }
    }

    const totalPrice = calculatedPrice * qty;

    await this.eventBus.publish(
      new PriceCalculatedEvent(query.productId, {
        productId: query.productId,
        calculatedPrice,
        currency,
      }),
    );

    return {
      productId: query.productId,
      unitPrice: calculatedPrice,
      quantity: qty,
      totalPrice,
      currency,
      appliedRule,
    };
  }
}
