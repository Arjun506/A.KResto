import { DomainEvent } from '../domain-event.interface';

export class CustomerRegisteredEvent implements DomainEvent<{
  customerId: string;
  customerCode?: string;
  identityType: string;
}> {
  readonly eventName = 'customer.registered';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      customerId: string;
      customerCode?: string;
      identityType: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerProfileUpdatedEvent implements DomainEvent<{
  customerId: string;
  changes: Record<string, any>;
}> {
  readonly eventName = 'customer.profile.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      customerId: string;
      changes: Record<string, any>;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerStatusChangedEvent implements DomainEvent<{
  customerId: string;
  previousStatus: string;
  newStatus: string;
}> {
  readonly eventName = 'customer.status.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      customerId: string;
      previousStatus: string;
      newStatus: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerLifecycleStageChangedEvent implements DomainEvent<{
  customerId: string;
  previousStage: string;
  newStage: string;
}> {
  readonly eventName = 'customer.lifecycle.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      customerId: string;
      previousStage: string;
      newStage: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerVerifiedEvent implements DomainEvent<{
  customerId: string;
  channel: string;
}> {
  readonly eventName = 'customer.verified';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string; channel: string },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerMergedEvent implements DomainEvent<{
  sourceCustomerId: string;
  targetCustomerId: string;
}> {
  readonly eventName = 'customer.merged';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      sourceCustomerId: string;
      targetCustomerId: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerConsentUpdatedEvent implements DomainEvent<{
  customerId: string;
  consentType: string;
  isGranted: boolean;
}> {
  readonly eventName = 'customer.consent.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      customerId: string;
      consentType: string;
      isGranted: boolean;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerPreferencesUpdatedEvent implements DomainEvent<{
  customerId: string;
  changes: Record<string, any>;
}> {
  readonly eventName = 'customer.preferences.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      customerId: string;
      changes: Record<string, any>;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerAddressAddedEvent implements DomainEvent<{
  customerId: string;
  addressId: string;
  type: string;
}> {
  readonly eventName = 'customer.address.added';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      customerId: string;
      addressId: string;
      type: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerContactAddedEvent implements DomainEvent<{
  customerId: string;
  contactId: string;
  type: string;
}> {
  readonly eventName = 'customer.contact.added';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      customerId: string;
      contactId: string;
      type: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerGroupAssignedEvent implements DomainEvent<{
  customerId: string;
  groupId: string;
}> {
  readonly eventName = 'customer.group.assigned';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string; groupId: string },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerTagAddedEvent implements DomainEvent<{
  customerId: string;
  tagId: string;
}> {
  readonly eventName = 'customer.tag.added';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string; tagId: string },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerRelationshipCreatedEvent implements DomainEvent<{
  sourceCustomerId: string;
  targetCustomerId?: string;
  type: string;
}> {
  readonly eventName = 'customer.relationship.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      sourceCustomerId: string;
      targetCustomerId?: string;
      type: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerCommunicationSentEvent implements DomainEvent<{
  customerId: string;
  channel: string;
  recipient: string;
}> {
  readonly eventName = 'customer.communication.sent';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      customerId: string;
      channel: string;
      recipient: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerArchivedEvent implements DomainEvent<{
  customerId: string;
}> {
  readonly eventName = 'customer.archived';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerReactivatedEvent implements DomainEvent<{
  customerId: string;
}> {
  readonly eventName = 'customer.reactivated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerDeletedEvent implements DomainEvent<{
  customerId: string;
}> {
  readonly eventName = 'customer.deleted';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string },
    public readonly tenantId?: string,
  ) {}
}
