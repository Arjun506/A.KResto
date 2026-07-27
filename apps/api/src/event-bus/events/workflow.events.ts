import { DomainEvent } from '../domain-event.interface';

export class WorkflowCreatedEvent implements DomainEvent<{
  workflowId: string;
  code: string;
  version: number;
}> {
  readonly eventName = 'workflow.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      workflowId: string;
      code: string;
      version: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class WorkflowPublishedEvent implements DomainEvent<{
  workflowId: string;
  code: string;
  version: number;
}> {
  readonly eventName = 'workflow.published';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      workflowId: string;
      code: string;
      version: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class WorkflowVersionCreatedEvent implements DomainEvent<{
  workflowId: string;
  code: string;
  version: number;
}> {
  readonly eventName = 'workflow.version.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      workflowId: string;
      code: string;
      version: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class WorkflowStartedEvent implements DomainEvent<{
  instanceId: string;
  workflowId: string;
}> {
  readonly eventName = 'workflow.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { instanceId: string; workflowId: string },
    public readonly tenantId?: string,
  ) {}
}

export class WorkflowCompletedEvent implements DomainEvent<{
  instanceId: string;
}> {
  readonly eventName = 'workflow.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { instanceId: string },
    public readonly tenantId?: string,
  ) {}
}

export class WorkflowCancelledEvent implements DomainEvent<{
  instanceId: string;
  reason?: string;
}> {
  readonly eventName = 'workflow.cancelled';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { instanceId: string; reason?: string },
    public readonly tenantId?: string,
  ) {}
}

export class TaskCreatedEvent implements DomainEvent<{
  taskId: string;
  instanceId: string;
  title: string;
}> {
  readonly eventName = 'workflow.task.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      taskId: string;
      instanceId: string;
      title: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class TaskAssignedEvent implements DomainEvent<{
  taskId: string;
  assignedTo: string;
}> {
  readonly eventName = 'workflow.task.assigned';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { taskId: string; assignedTo: string },
    public readonly tenantId?: string,
  ) {}
}

export class TaskDelegatedEvent implements DomainEvent<{
  taskId: string;
  delegatedTo: string;
}> {
  readonly eventName = 'workflow.task.delegated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { taskId: string; delegatedTo: string },
    public readonly tenantId?: string,
  ) {}
}

export class TaskCompletedEvent implements DomainEvent<{
  taskId: string;
  status: string;
}> {
  readonly eventName = 'workflow.task.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { taskId: string; status: string },
    public readonly tenantId?: string,
  ) {}
}

export class ParallelBranchStartedEvent implements DomainEvent<{
  instanceId: string;
  branchName: string;
}> {
  readonly eventName = 'workflow.parallel.branch.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { instanceId: string; branchName: string },
    public readonly tenantId?: string,
  ) {}
}

export class ParallelBranchCompletedEvent implements DomainEvent<{
  instanceId: string;
  branchName: string;
}> {
  readonly eventName = 'workflow.parallel.branch.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { instanceId: string; branchName: string },
    public readonly tenantId?: string,
  ) {}
}

export class CompensationStartedEvent implements DomainEvent<{
  instanceId: string;
  rollbackStep: string;
}> {
  readonly eventName = 'workflow.compensation.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { instanceId: string; rollbackStep: string },
    public readonly tenantId?: string,
  ) {}
}

export class CompensationCompletedEvent implements DomainEvent<{
  instanceId: string;
  rollbackStep: string;
}> {
  readonly eventName = 'workflow.compensation.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { instanceId: string; rollbackStep: string },
    public readonly tenantId?: string,
  ) {}
}

export class ApprovalRequestedEvent implements DomainEvent<{
  approvalId: string;
  stepName: string;
}> {
  readonly eventName = 'workflow.approval.requested';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { approvalId: string; stepName: string },
    public readonly tenantId?: string,
  ) {}
}

export class ApprovalGrantedEvent implements DomainEvent<{
  approvalId: string;
  signedBy?: string;
}> {
  readonly eventName = 'workflow.approval.granted';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { approvalId: string; signedBy?: string },
    public readonly tenantId?: string,
  ) {}
}

export class ApprovalRejectedEvent implements DomainEvent<{
  approvalId: string;
  signedBy?: string;
  comment?: string;
}> {
  readonly eventName = 'workflow.approval.rejected';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      approvalId: string;
      signedBy?: string;
      comment?: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class RuleExecutedEvent implements DomainEvent<{
  ruleCode: string;
  evaluationResult: boolean;
}> {
  readonly eventName = 'workflow.rule.executed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { ruleCode: string; evaluationResult: boolean },
    public readonly tenantId?: string,
  ) {}
}

export class AutomationTriggeredEvent implements DomainEvent<{
  actionName: string;
}> {
  readonly eventName = 'workflow.automation.triggered';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { actionName: string },
    public readonly tenantId?: string,
  ) {}
}

export class JobScheduledEvent implements DomainEvent<{
  jobCode: string;
  executeAt: Date;
}> {
  readonly eventName = 'workflow.job.scheduled';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { jobCode: string; executeAt: Date },
    public readonly tenantId?: string,
  ) {}
}

export class JobExecutedEvent implements DomainEvent<{
  jobCode: string;
  durationMs: number;
}> {
  readonly eventName = 'workflow.job.executed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { jobCode: string; durationMs: number },
    public readonly tenantId?: string,
  ) {}
}

export class WebhookDeliveredEvent implements DomainEvent<{
  webhookId: string;
  targetUrl: string;
  responseCode: number;
}> {
  readonly eventName = 'workflow.webhook.delivered';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      webhookId: string;
      targetUrl: string;
      responseCode: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class EscalationTriggeredEvent implements DomainEvent<{
  referenceId: string;
  targetUserId?: string;
}> {
  readonly eventName = 'workflow.escalation.triggered';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { referenceId: string; targetUserId?: string },
    public readonly tenantId?: string,
  ) {}
}

export class SLAExceededEvent implements DomainEvent<{
  referenceId: string;
  targetDueDate: Date;
}> {
  readonly eventName = 'workflow.sla.exceeded';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { referenceId: string; targetDueDate: Date },
    public readonly tenantId?: string,
  ) {}
}

export class NotificationTriggeredEvent implements DomainEvent<{
  templateCode: string;
  recipient: string;
}> {
  readonly eventName = 'workflow.notification.triggered';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { templateCode: string; recipient: string },
    public readonly tenantId?: string,
  ) {}
}

export class StateChangedEvent implements DomainEvent<{
  previousState: string;
  newState: string;
}> {
  readonly eventName = 'workflow.state.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { previousState: string; newState: string },
    public readonly tenantId?: string,
  ) {}
}

export class DecisionEvaluatedEvent implements DomainEvent<{
  tableCode: string;
  decisionOutput: any;
}> {
  readonly eventName = 'workflow.decision.evaluated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { tableCode: string; decisionOutput: any },
    public readonly tenantId?: string,
  ) {}
}

export class WorkflowMigratedEvent implements DomainEvent<{
  instanceId: string;
  fromVersion: number;
  toVersion: number;
}> {
  readonly eventName = 'workflow.migrated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      instanceId: string;
      fromVersion: number;
      toVersion: number;
    },
    public readonly tenantId?: string,
  ) {}
}
