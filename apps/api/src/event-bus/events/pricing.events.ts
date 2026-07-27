import { DomainEvent } from '../domain-event.interface';

export class PriceBookCreatedEvent implements DomainEvent<{
  priceBookId: string;
  code: string;
  name: string;
}> {
  readonly eventName = 'pricing.book.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      priceBookId: string;
      code: string;
      name: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PriceListCreatedEvent implements DomainEvent<{
  priceListId: string;
  priceBookId: string;
  currency: string;
}> {
  readonly eventName = 'pricing.list.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      priceListId: string;
      priceBookId: string;
      currency: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PriceRuleCreatedEvent implements DomainEvent<{
  priceRuleId: string;
  ruleType: string;
  value: number;
}> {
  readonly eventName = 'pricing.rule.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      priceRuleId: string;
      ruleType: string;
      value: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PriceCalculatedEvent implements DomainEvent<{
  productId: string;
  calculatedPrice: number;
  currency: string;
}> {
  readonly eventName = 'pricing.calculated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      productId: string;
      calculatedPrice: number;
      currency: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PriceChangedEvent implements DomainEvent<{
  productId: string;
  oldPrice?: number;
  newPrice: number;
  currency: string;
}> {
  readonly eventName = 'pricing.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      productId: string;
      oldPrice?: number;
      newPrice: number;
      currency: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PriceActivatedEvent implements DomainEvent<{
  priceBookId: string;
}> {
  readonly eventName = 'pricing.activated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { priceBookId: string },
    public readonly tenantId?: string,
  ) {}
}

export class PriceExpiredEvent implements DomainEvent<{ priceBookId: string }> {
  readonly eventName = 'pricing.expired';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { priceBookId: string },
    public readonly tenantId?: string,
  ) {}
}

export class PromotionStartedEvent implements DomainEvent<{
  promotionId: string;
  code: string;
}> {
  readonly eventName = 'pricing.promotion.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { promotionId: string; code: string },
    public readonly tenantId?: string,
  ) {}
}

export class PromotionEndedEvent implements DomainEvent<{
  promotionId: string;
  code: string;
}> {
  readonly eventName = 'pricing.promotion.ended';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { promotionId: string; code: string },
    public readonly tenantId?: string,
  ) {}
}

export class DiscountPolicyUpdatedEvent implements DomainEvent<{
  policyId: string;
  maxDiscountPercentage: number;
}> {
  readonly eventName = 'pricing.discount_policy.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      policyId: string;
      maxDiscountPercentage: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PricingVersionCreatedEvent implements DomainEvent<{
  priceBookId: string;
  versionNumber: number;
}> {
  readonly eventName = 'pricing.version.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { priceBookId: string; versionNumber: number },
    public readonly tenantId?: string,
  ) {}
}

export class PricingPublishedEvent implements DomainEvent<{
  priceBookId: string;
  versionNumber: number;
}> {
  readonly eventName = 'pricing.published';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { priceBookId: string; versionNumber: number },
    public readonly tenantId?: string,
  ) {}
}

export class PricingRejectedEvent implements DomainEvent<{
  priceBookId: string;
  reason: string;
}> {
  readonly eventName = 'pricing.rejected';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { priceBookId: string; reason: string },
    public readonly tenantId?: string,
  ) {}
}

export class PricingSimulationExecutedEvent implements DomainEvent<{
  productId: string;
  simulationResult: any;
}> {
  readonly eventName = 'pricing.simulation.executed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { productId: string; simulationResult: any },
    public readonly tenantId?: string,
  ) {}
}

export class CouponCreatedEvent implements DomainEvent<{
  couponId: string;
  code: string;
  value: number;
}> {
  readonly eventName = 'pricing.coupon.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { couponId: string; code: string; value: number },
    public readonly tenantId?: string,
  ) {}
}

export class ExchangeRateUpdatedEvent implements DomainEvent<{
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
}> {
  readonly eventName = 'pricing.exchange_rate.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      baseCurrency: string;
      targetCurrency: string;
      rate: number;
    },
    public readonly tenantId?: string,
  ) {}
}
