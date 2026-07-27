import { DomainEvent } from '../domain-event.interface';

export class WorkspaceSwitchedEvent implements DomainEvent<{
  workspaceCode: string;
  userId: string;
}> {
  readonly eventName = 'console.workspace.switched';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { workspaceCode: string; userId: string },
    public readonly tenantId?: string,
  ) {}
}

export class DashboardLayoutSavedEvent implements DomainEvent<{
  dashboardId: string;
  userId: string;
}> {
  readonly eventName = 'console.dashboard.layout.saved';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { dashboardId: string; userId: string },
    public readonly tenantId?: string,
  ) {}
}

export class CommandExecutedEvent implements DomainEvent<{
  triggerPhrase: string;
  userId: string;
}> {
  readonly eventName = 'console.command.executed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { triggerPhrase: string; userId: string },
    public readonly tenantId?: string,
  ) {}
}

export class CollaborationSessionSyncedEvent implements DomainEvent<{
  sessionCode: string;
  activeUsersCount: number;
}> {
  readonly eventName = 'console.collaboration.session.synced';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { sessionCode: string; activeUsersCount: number },
    public readonly tenantId?: string,
  ) {}
}

export class ViewBookmarkedEvent implements DomainEvent<{
  pageCode: string;
  userId: string;
}> {
  readonly eventName = 'console.view.bookmarked';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { pageCode: string; userId: string },
    public readonly tenantId?: string,
  ) {}
}
