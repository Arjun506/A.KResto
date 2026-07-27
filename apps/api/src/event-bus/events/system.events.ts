import { DomainEvent } from '../domain-event.interface';

export class UserCreatedEvent implements DomainEvent<{
  userId: string;
  email: string;
  role: string;
}> {
  readonly eventName = 'identity.user.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; email: string; role: string },
    public readonly tenantId?: string,
  ) {}
}

export class TenantCreatedEvent implements DomainEvent<{
  tenantId: string;
  name: string;
  slug: string;
}> {
  readonly eventName = 'tenant.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { tenantId: string; name: string; slug: string },
  ) {
    this.tenantId = aggregateId;
  }
  public readonly tenantId: string;
}

export class RoleAssignedEvent implements DomainEvent<{
  userId: string;
  roleName: string;
}> {
  readonly eventName = 'iam.role.assigned';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; roleName: string },
    public readonly tenantId?: string,
  ) {}
}

export class PermissionUpdatedEvent implements DomainEvent<{
  roleName: string;
  permissions: string[];
}> {
  readonly eventName = 'iam.permission.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { roleName: string; permissions: string[] },
    public readonly tenantId?: string,
  ) {}
}

export class LoginSucceededEvent implements DomainEvent<{
  userId: string;
  ipAddress?: string;
}> {
  readonly eventName = 'auth.login.succeeded';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; ipAddress?: string },
    public readonly tenantId?: string,
  ) {}
}

export class PasswordChangedEvent implements DomainEvent<{ userId: string }> {
  readonly eventName = 'auth.password.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string },
    public readonly tenantId?: string,
  ) {}
}
