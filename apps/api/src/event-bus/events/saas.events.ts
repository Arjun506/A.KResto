import { DomainEvent } from '../domain-event.interface';

export class TenantProvisioningStartedEvent implements DomainEvent<{
  tenantId: string;
  slug: string;
}> {
  readonly eventName = 'saas.tenant.provisioning.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { tenantId: string; slug: string },
    public readonly tenantId?: string,
  ) {}
}

export class TenantProvisionedEvent implements DomainEvent<{
  tenantId: string;
  slug: string;
}> {
  readonly eventName = 'saas.tenant.provisioned';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { tenantId: string; slug: string },
    public readonly tenantId?: string,
  ) {}
}

export class TenantProvisioningFailedEvent implements DomainEvent<{
  tenantId: string;
  error: string;
}> {
  readonly eventName = 'saas.tenant.provisioning.failed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { tenantId: string; error: string },
    public readonly tenantId?: string,
  ) {}
}

export class TrialStartedEvent implements DomainEvent<{
  tenantId: string;
  planName: string;
  expiresAt: Date;
}> {
  readonly eventName = 'saas.trial.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      tenantId: string;
      planName: string;
      expiresAt: Date;
    },
    public readonly tenantId?: string,
  ) {}
}

export class TrialExpiredEvent implements DomainEvent<{ tenantId: string }> {
  readonly eventName = 'saas.trial.expired';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { tenantId: string },
    public readonly tenantId?: string,
  ) {}
}

export class SubscriptionActivatedEvent implements DomainEvent<{
  tenantId: string;
  planName: string;
}> {
  readonly eventName = 'saas.subscription.activated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { tenantId: string; planName: string },
    public readonly tenantId?: string,
  ) {}
}

export class SubscriptionRenewedEvent implements DomainEvent<{
  tenantId: string;
  currentPeriodEnd: Date;
}> {
  readonly eventName = 'saas.subscription.renewed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { tenantId: string; currentPeriodEnd: Date },
    public readonly tenantId?: string,
  ) {}
}

export class SubscriptionUpgradedEvent implements DomainEvent<{
  tenantId: string;
  oldPlan: string;
  newPlan: string;
}> {
  readonly eventName = 'saas.subscription.upgraded';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      tenantId: string;
      oldPlan: string;
      newPlan: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class SubscriptionDowngradedEvent implements DomainEvent<{
  tenantId: string;
  oldPlan: string;
  newPlan: string;
}> {
  readonly eventName = 'saas.subscription.downgraded';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      tenantId: string;
      oldPlan: string;
      newPlan: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class SubscriptionPastDueEvent implements DomainEvent<{
  tenantId: string;
}> {
  readonly eventName = 'saas.subscription.past_due';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { tenantId: string },
    public readonly tenantId?: string,
  ) {}
}

export class SubscriptionCancelledEvent implements DomainEvent<{
  tenantId: string;
}> {
  readonly eventName = 'saas.subscription.cancelled';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { tenantId: string },
    public readonly tenantId?: string,
  ) {}
}

export class EntitlementChangedEvent implements DomainEvent<{
  tenantId: string;
  key: string;
  oldValue: any;
  newValue: any;
}> {
  readonly eventName = 'saas.entitlement.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      tenantId: string;
      key: string;
      oldValue: any;
      newValue: any;
    },
    public readonly tenantId?: string,
  ) {}
}

export class UsageLimitWarningEvent implements DomainEvent<{
  tenantId: string;
  key: string;
  usage: number;
  limit: number;
}> {
  readonly eventName = 'saas.usage.limit.warning';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      tenantId: string;
      key: string;
      usage: number;
      limit: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class UsageLimitExceededEvent implements DomainEvent<{
  tenantId: string;
  key: string;
  usage: number;
  limit: number;
}> {
  readonly eventName = 'saas.usage.limit.exceeded';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      tenantId: string;
      key: string;
      usage: number;
      limit: number;
    },
    public readonly tenantId?: string,
  ) {}
}
