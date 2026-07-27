import { DomainEvent } from '../domain-event.interface';

export class RetailSaleCompletedEvent implements DomainEvent<{
  orderId: string;
  registerId: string;
  totalAmount: number;
}> {
  readonly eventName = 'retail.sale.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      orderId: string;
      registerId: string;
      totalAmount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class StockTransferInitiatedEvent implements DomainEvent<{
  productId: string;
  sourceStoreId: string;
  destStoreId: string;
  quantity: number;
}> {
  readonly eventName = 'retail.stock.transfer.initiated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      productId: string;
      sourceStoreId: string;
      destStoreId: string;
      quantity: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PromotionAppliedEvent implements DomainEvent<{
  promotionId: string;
  orderId: string;
  discountPercent: number;
}> {
  readonly eventName = 'retail.promotion.applied';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      promotionId: string;
      orderId: string;
      discountPercent: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ReturnAuthorizedEvent implements DomainEvent<{
  returnId: string;
  orderId: string;
  refundAmount: number;
}> {
  readonly eventName = 'retail.return.authorized';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      returnId: string;
      orderId: string;
      refundAmount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PurchaseOrderReceivedEvent implements DomainEvent<{
  purchaseOrderId: string;
  supplierId: string;
  status: string;
}> {
  readonly eventName = 'retail.po.received';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      purchaseOrderId: string;
      supplierId: string;
      status: string;
    },
    public readonly tenantId?: string,
  ) {}
}
