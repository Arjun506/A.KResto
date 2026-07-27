export interface DomainEvent<TPayload = any> {
  eventName: string;
  aggregateId: string;
  tenantId?: string;
  occurredOn: Date;
  payload: TPayload;
}

export interface IEventPublisher {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  publishAll<T extends DomainEvent>(events: T[]): Promise<void>;
}

export interface IEventSubscriber<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
}
