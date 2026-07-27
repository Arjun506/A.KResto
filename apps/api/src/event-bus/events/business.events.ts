import { DomainEvent } from '../domain-event.interface';

export class BusinessCreatedEvent implements DomainEvent<{
  businessId: string;
  name: string;
  status: string;
}> {
  readonly eventName = 'business.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      businessId: string;
      name: string;
      status: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class BusinessUpdatedEvent implements DomainEvent<{
  businessId: string;
  changes: Record<string, any>;
}> {
  readonly eventName = 'business.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      businessId: string;
      changes: Record<string, any>;
    },
    public readonly tenantId?: string,
  ) {}
}

export class BusinessStatusChangedEvent implements DomainEvent<{
  businessId: string;
  previousStatus: string;
  newStatus: string;
}> {
  readonly eventName = 'business.status.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      businessId: string;
      previousStatus: string;
      newStatus: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class BusinessVerifiedEvent implements DomainEvent<{
  businessId: string;
  verifiedAt: Date;
}> {
  readonly eventName = 'business.verified';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { businessId: string; verifiedAt: Date },
    public readonly tenantId?: string,
  ) {}
}

export class BusinessDeletedEvent implements DomainEvent<{
  businessId: string;
}> {
  readonly eventName = 'business.deleted';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { businessId: string },
    public readonly tenantId?: string,
  ) {}
}

export class BusinessOwnershipTransferredEvent implements DomainEvent<{
  businessId: string;
  previousOwnerId?: string;
  newOwnerId: string;
}> {
  readonly eventName = 'business.ownership.transferred';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      businessId: string;
      previousOwnerId?: string;
      newOwnerId: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class BusinessRelationshipCreatedEvent implements DomainEvent<{
  sourceBusinessId: string;
  targetBusinessId: string;
  type: string;
}> {
  readonly eventName = 'business.relationship.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      sourceBusinessId: string;
      targetBusinessId: string;
      type: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class BusinessAddressAddedEvent implements DomainEvent<{
  businessId: string;
  addressId: string;
  type: string;
}> {
  readonly eventName = 'business.address.added';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      businessId: string;
      addressId: string;
      type: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class BusinessAttachmentUploadedEvent implements DomainEvent<{
  businessId: string;
  attachmentId: string;
  category: string;
}> {
  readonly eventName = 'business.attachment.uploaded';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      businessId: string;
      attachmentId: string;
      category: string;
    },
    public readonly tenantId?: string,
  ) {}
}
