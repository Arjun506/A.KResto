import { DomainEvent } from '../domain-event.interface';

export class ProductCreatedEvent implements DomainEvent<{
  productId: string;
  sku: string;
  name: string;
  identityType: string;
}> {
  readonly eventName = 'product.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      productId: string;
      sku: string;
      name: string;
      identityType: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ProductUpdatedEvent implements DomainEvent<{
  productId: string;
  changes: Record<string, any>;
}> {
  readonly eventName = 'product.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      productId: string;
      changes: Record<string, any>;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ProductStatusChangedEvent implements DomainEvent<{
  productId: string;
  previousStatus: string;
  newStatus: string;
}> {
  readonly eventName = 'product.status.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      productId: string;
      previousStatus: string;
      newStatus: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ProductPublishedEvent implements DomainEvent<{
  productId: string;
  versionNumber: number;
}> {
  readonly eventName = 'product.published';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { productId: string; versionNumber: number },
    public readonly tenantId?: string,
  ) {}
}

export class ProductVersionCreatedEvent implements DomainEvent<{
  productId: string;
  versionNumber: number;
  status: string;
}> {
  readonly eventName = 'product.version.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      productId: string;
      versionNumber: number;
      status: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ProductRelationshipCreatedEvent implements DomainEvent<{
  sourceProductId: string;
  targetProductId: string;
  type: string;
}> {
  readonly eventName = 'product.relationship.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      sourceProductId: string;
      targetProductId: string;
      type: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ProductLocalizedEvent implements DomainEvent<{
  productId: string;
  locale: string;
}> {
  readonly eventName = 'product.localized';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { productId: string; locale: string },
    public readonly tenantId?: string,
  ) {}
}

export class ProductVisibilityChangedEvent implements DomainEvent<{
  productId: string;
  publishingStatus: string;
}> {
  readonly eventName = 'product.visibility.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { productId: string; publishingStatus: string },
    public readonly tenantId?: string,
  ) {}
}

export class ProductArchivedEvent implements DomainEvent<{
  productId: string;
}> {
  readonly eventName = 'product.archived';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { productId: string },
    public readonly tenantId?: string,
  ) {}
}

export class ProductActivatedEvent implements DomainEvent<{
  productId: string;
}> {
  readonly eventName = 'product.activated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { productId: string },
    public readonly tenantId?: string,
  ) {}
}

export class ProductCategoryAssignedEvent implements DomainEvent<{
  productId: string;
  categoryId: string;
}> {
  readonly eventName = 'product.category.assigned';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { productId: string; categoryId: string },
    public readonly tenantId?: string,
  ) {}
}

export class ProductPriceChangedEvent implements DomainEvent<{
  productId: string;
  priceType: string;
  amount: number;
  currency: string;
}> {
  readonly eventName = 'product.price.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      productId: string;
      priceType: string;
      amount: number;
      currency: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ProductMediaAddedEvent implements DomainEvent<{
  productId: string;
  mediaId: string;
  type: string;
}> {
  readonly eventName = 'product.media.added';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      productId: string;
      mediaId: string;
      type: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ProductVariantCreatedEvent implements DomainEvent<{
  productId: string;
  variantId: string;
  sku: string;
}> {
  readonly eventName = 'product.variant.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      productId: string;
      variantId: string;
      sku: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ProductBundleCreatedEvent implements DomainEvent<{
  parentProductId: string;
  componentProductId: string;
}> {
  readonly eventName = 'product.bundle.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      parentProductId: string;
      componentProductId: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ProductDeletedEvent implements DomainEvent<{ productId: string }> {
  readonly eventName = 'product.deleted';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { productId: string },
    public readonly tenantId?: string,
  ) {}
}
