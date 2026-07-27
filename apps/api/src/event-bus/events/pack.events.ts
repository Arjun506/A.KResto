import { DomainEvent } from '../domain-event.interface';

export class PackUploadedEvent implements DomainEvent<{
  packId: string;
  code: string;
}> {
  readonly eventName = 'platform.pack.uploaded';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { packId: string; code: string },
    public readonly tenantId?: string,
  ) {}
}

export class PackInstalledEvent implements DomainEvent<{
  packId: string;
  code: string;
  version: string;
}> {
  readonly eventName = 'platform.pack.installed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { packId: string; code: string; version: string },
    public readonly tenantId?: string,
  ) {}
}

export class PackActivatedEvent implements DomainEvent<{
  packId: string;
  tenantId: string;
}> {
  readonly eventName = 'platform.pack.activated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { packId: string; tenantId: string },
    public readonly tenantId?: string,
  ) {}
}

export class PackDisabledEvent implements DomainEvent<{
  packId: string;
  tenantId: string;
}> {
  readonly eventName = 'platform.pack.disabled';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { packId: string; tenantId: string },
    public readonly tenantId?: string,
  ) {}
}

export class PackUpgradedEvent implements DomainEvent<{
  packId: string;
  fromVersion: string;
  toVersion: string;
}> {
  readonly eventName = 'platform.pack.upgraded';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      packId: string;
      fromVersion: string;
      toVersion: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PackRollbackStartedEvent implements DomainEvent<{
  packId: string;
  fromVersion: string;
  targetVersion: string;
}> {
  readonly eventName = 'platform.pack.rollback.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      packId: string;
      fromVersion: string;
      targetVersion: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PackUninstalledEvent implements DomainEvent<{
  packId: string;
  code: string;
}> {
  readonly eventName = 'platform.pack.uninstalled';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { packId: string; code: string },
    public readonly tenantId?: string,
  ) {}
}

export class PackHealthFailedEvent implements DomainEvent<{
  packId: string;
  score: number;
  errors: any;
}> {
  readonly eventName = 'platform.pack.health.failed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { packId: string; score: number; errors: any },
    public readonly tenantId?: string,
  ) {}
}
