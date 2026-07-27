import { DomainEvent } from '../domain-event.interface';

export class TransactionCreatedEvent implements DomainEvent<{
  transactionId: string;
  transactionNumber: string;
  transactionType: string;
  amount: number;
}> {
  readonly eventName = 'order.transaction.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      transactionId: string;
      transactionNumber: string;
      transactionType: string;
      amount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class OrderCreatedEvent implements DomainEvent<{
  orderId: string;
  orderNumber: string;
  grandTotal: number;
}> {
  readonly eventName = 'order.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      orderId: string;
      orderNumber: string;
      grandTotal: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class OrderSubmittedEvent implements DomainEvent<{
  orderId: string;
  orderNumber: string;
}> {
  readonly eventName = 'order.submitted';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string; orderNumber: string },
    public readonly tenantId?: string,
  ) {}
}

export class OrderApprovedEvent implements DomainEvent<{
  orderId: string;
  approvedBy?: string;
}> {
  readonly eventName = 'order.approved';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string; approvedBy?: string },
    public readonly tenantId?: string,
  ) {}
}

export class OrderRejectedEvent implements DomainEvent<{
  orderId: string;
  reason?: string;
}> {
  readonly eventName = 'order.rejected';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string; reason?: string },
    public readonly tenantId?: string,
  ) {}
}

export class OrderConfirmedEvent implements DomainEvent<{ orderId: string }> {
  readonly eventName = 'order.confirmed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string },
    public readonly tenantId?: string,
  ) {}
}

export class OrderReservedEvent implements DomainEvent<{
  orderId: string;
  reservationIds: string[];
}> {
  readonly eventName = 'order.reserved';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string; reservationIds: string[] },
    public readonly tenantId?: string,
  ) {}
}

export class OrderReleasedEvent implements DomainEvent<{ orderId: string }> {
  readonly eventName = 'order.released';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string },
    public readonly tenantId?: string,
  ) {}
}

export class OrderCancelledEvent implements DomainEvent<{
  orderId: string;
  reasonCode: string;
}> {
  readonly eventName = 'order.cancelled';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string; reasonCode: string },
    public readonly tenantId?: string,
  ) {}
}

export class OrderReturnedEvent implements DomainEvent<{
  rmaNumber: string;
  orderId: string;
  refundAmount: number;
}> {
  readonly eventName = 'order.returned';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      rmaNumber: string;
      orderId: string;
      refundAmount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class OrderExchangedEvent implements DomainEvent<{
  originalOrderId: string;
  replacementOrderId: string;
}> {
  readonly eventName = 'order.exchanged';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      originalOrderId: string;
      replacementOrderId: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class OrderCompletedEvent implements DomainEvent<{ orderId: string }> {
  readonly eventName = 'order.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string },
    public readonly tenantId?: string,
  ) {}
}

export class OrderVersionCreatedEvent implements DomainEvent<{
  orderId: string;
  versionNumber: number;
}> {
  readonly eventName = 'order.version.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string; versionNumber: number },
    public readonly tenantId?: string,
  ) {}
}

export class FulfillmentStartedEvent implements DomainEvent<{
  orderId: string;
  fulfillmentType: string;
}> {
  readonly eventName = 'order.fulfillment.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string; fulfillmentType: string },
    public readonly tenantId?: string,
  ) {}
}

export class FulfillmentCompletedEvent implements DomainEvent<{
  orderId: string;
}> {
  readonly eventName = 'order.fulfillment.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string },
    public readonly tenantId?: string,
  ) {}
}

export class OrderPartiallyFulfilledEvent implements DomainEvent<{
  orderId: string;
  fulfilledQuantity: number;
}> {
  readonly eventName = 'order.fulfillment.partially';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string; fulfilledQuantity: number },
    public readonly tenantId?: string,
  ) {}
}

export class ShipmentCreatedEvent implements DomainEvent<{
  shipmentId: string;
  shipmentNumber: string;
  orderId: string;
}> {
  readonly eventName = 'order.shipment.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      shipmentId: string;
      shipmentNumber: string;
      orderId: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PackageCreatedEvent implements DomainEvent<{
  packageId: string;
  shipmentId: string;
}> {
  readonly eventName = 'order.package.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { packageId: string; shipmentId: string },
    public readonly tenantId?: string,
  ) {}
}

export class DeliveryAttemptedEvent implements DomainEvent<{
  shipmentId: string;
  status: string;
}> {
  readonly eventName = 'order.delivery.attempted';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { shipmentId: string; status: string },
    public readonly tenantId?: string,
  ) {}
}

export class ReturnAuthorizedEvent implements DomainEvent<{
  rmaNumber: string;
  orderId: string;
}> {
  readonly eventName = 'order.return.authorized';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { rmaNumber: string; orderId: string },
    public readonly tenantId?: string,
  ) {}
}

export class RefundRequestedEvent implements DomainEvent<{
  refundId: string;
  orderId: string;
  amount: number;
}> {
  readonly eventName = 'order.refund.requested';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      refundId: string;
      orderId: string;
      amount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class OrderSnapshotCreatedEvent implements DomainEvent<{
  snapshotId: string;
  orderId: string;
}> {
  readonly eventName = 'order.snapshot.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { snapshotId: string; orderId: string },
    public readonly tenantId?: string,
  ) {}
}

export class RoutingCompletedEvent implements DomainEvent<{
  orderId: string;
  targetWarehouseId: string;
}> {
  readonly eventName = 'order.routing.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string; targetWarehouseId: string },
    public readonly tenantId?: string,
  ) {}
}
