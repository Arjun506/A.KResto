import { DomainEvent } from '../domain-event.interface';

export class CustomerSearchExecutedEvent implements DomainEvent<{
  query: string;
  resultsCount: number;
}> {
  readonly eventName = 'customer.search.executed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { query: string; resultsCount: number },
    public readonly tenantId?: string,
  ) {}
}

export class CartUpdatedEvent implements DomainEvent<{
  cartId: string;
  itemsCount: number;
}> {
  readonly eventName = 'customer.cart.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { cartId: string; itemsCount: number },
    public readonly tenantId?: string,
  ) {}
}

export class CheckoutCompletedEvent implements DomainEvent<{
  orderId: string;
  amount: number;
}> {
  readonly eventName = 'customer.checkout.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string; amount: number },
    public readonly tenantId?: string,
  ) {}
}

export class ReviewSubmittedEvent implements DomainEvent<{
  reviewId: string;
  rating: number;
}> {
  readonly eventName = 'customer.review.submitted';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { reviewId: string; rating: number },
    public readonly tenantId?: string,
  ) {}
}

export class TimelineEventLoggedEvent implements DomainEvent<{
  customerId: string;
  eventType: string;
}> {
  readonly eventName = 'customer.timeline.event.logged';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string; eventType: string },
    public readonly tenantId?: string,
  ) {}
}

export class ConsentUpdatedEvent implements DomainEvent<{
  customerId: string;
  gdprOptOut: boolean;
}> {
  readonly eventName = 'customer.consent.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string; gdprOptOut: boolean },
    public readonly tenantId?: string,
  ) {}
}
