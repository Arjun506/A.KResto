import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SimulatePricingQueryDto } from './simulate-pricing-query.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { PricingSimulationExecutedEvent } from '../../event-bus/events/pricing.events';

@Injectable()
export class PricingSimulationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async simulatePricing(dto: SimulatePricingQueryDto) {
    const product = await this.prisma.products.findFirst({
      where: { id: dto.productId, deletedAt: null },
      include: { prices: true },
    });

    if (!product) {
      throw new NotFoundException(`Product ${dto.productId} not found`);
    }

    const basePrice =
      product.prices.find((p) => p.priceType === 'BASE')?.amount || 100.0;
    let finalPrice = basePrice;
    const appliedRules: string[] = ['Base Price Applied'];

    if (dto.customerId) {
      const custPrice = await this.prisma.customer_prices.findFirst({
        where: { customerId: dto.customerId, productId: dto.productId },
      });
      if (custPrice) {
        finalPrice = custPrice.customPrice;
        appliedRules.push(
          `Customer Specific Price Override ($${custPrice.customPrice})`,
        );
      }
    }

    if (dto.couponCode) {
      const coupon = await this.prisma.coupons.findFirst({
        where: { code: dto.couponCode, deletedAt: null },
      });
      if (coupon) {
        if (coupon.type === 'PERCENTAGE') {
          const discount = (finalPrice * coupon.value) / 100;
          finalPrice -= discount;
          appliedRules.push(
            `Coupon ${coupon.code} applied (${coupon.value}% off)`,
          );
        }
      }
    }

    const simulationResult = {
      productId: dto.productId,
      originalBasePrice: basePrice,
      simulatedFinalPrice: Math.max(0, finalPrice),
      priceDifference: basePrice - Math.max(0, finalPrice),
      appliedRules,
    };

    await this.eventBus.publish(
      new PricingSimulationExecutedEvent(dto.productId, {
        productId: dto.productId,
        simulationResult,
      }),
    );

    return simulationResult;
  }
}
