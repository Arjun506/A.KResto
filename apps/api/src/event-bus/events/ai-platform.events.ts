import { DomainEvent } from '../domain-event.interface';

export class PromptExecutedEvent implements DomainEvent<{
  promptCode: string;
  latencyMs: number;
}> {
  readonly eventName = 'ai.prompt.executed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { promptCode: string; latencyMs: number },
    public readonly tenantId?: string,
  ) {}
}

export class AgentStartedEvent implements DomainEvent<{
  agentId: string;
  runId: string;
}> {
  readonly eventName = 'ai.agent.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { agentId: string; runId: string },
    public readonly tenantId?: string,
  ) {}
}

export class AgentCompletedEvent implements DomainEvent<{
  agentId: string;
  runId: string;
  status: string;
}> {
  readonly eventName = 'ai.agent.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { agentId: string; runId: string; status: string },
    public readonly tenantId?: string,
  ) {}
}

export class AutomationExecutedEvent implements DomainEvent<{
  triggerName: string;
  success: boolean;
}> {
  readonly eventName = 'ai.automation.executed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { triggerName: string; success: boolean },
    public readonly tenantId?: string,
  ) {}
}

export class RecommendationGeneratedEvent implements DomainEvent<{
  recommendationId: string;
  itemsCount: number;
}> {
  readonly eventName = 'ai.recommendation.generated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { recommendationId: string; itemsCount: number },
    public readonly tenantId?: string,
  ) {}
}

export class ForecastCompletedEvent implements DomainEvent<{
  metricCode: string;
  valueForecasted: number;
}> {
  readonly eventName = 'ai.forecast.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { metricCode: string; valueForecasted: number },
    public readonly tenantId?: string,
  ) {}
}

export class MemoryUpdatedEvent implements DomainEvent<{
  customerId: string;
  summarySnippet: string;
}> {
  readonly eventName = 'ai.memory.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string; summarySnippet: string },
    public readonly tenantId?: string,
  ) {}
}
