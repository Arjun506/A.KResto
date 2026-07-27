import { Injectable } from '@nestjs/common';
import { PricingStrategyType } from '@prisma/client';

@Injectable()
export class PricingStrategyService {
  getAvailableStrategies() {
    return [
      {
        type: PricingStrategyType.FIXED_PRICE,
        description: 'Static price list per product SKU',
      },
      {
        type: PricingStrategyType.COST_PLUS,
        description: 'Cost price + configurable markup percentage',
      },
      {
        type: PricingStrategyType.DYNAMIC,
        description: 'Demand & channel dynamic rate adjustments',
      },
      {
        type: PricingStrategyType.SUBSCRIPTION,
        description: 'Recurring billing interval rates (Monthly, Annual)',
      },
      {
        type: PricingStrategyType.USAGE_BASED,
        description: 'Metered volume tier price calculation',
      },
      {
        type: PricingStrategyType.COMPETITIVE,
        description: 'Market index benchmark matching strategy',
      },
    ];
  }

  evaluateStrategyPrice(
    basePrice: number,
    costPrice: number | undefined,
    strategy: PricingStrategyType,
    markupPercentage: number = 20,
  ): number {
    switch (strategy) {
      case PricingStrategyType.COST_PLUS:
        return (costPrice ?? basePrice) * (1 + markupPercentage / 100);
      case PricingStrategyType.FIXED_PRICE:
      default:
        return basePrice;
    }
  }
}
