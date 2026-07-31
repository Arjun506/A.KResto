import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusModule } from '../event-bus/event-bus.module';

import { WorkflowRegistryService } from './registry/workflow-registry.service';
import { WorkflowRegistryController } from './registry/workflow-registry.controller';

import { BpmnCompatService } from './bpmn-compat/bpmn-compat.service';
import { BpmnCompatController } from './bpmn-compat/bpmn-compat.controller';

import { WorkflowInstancesService } from './instances/workflow-instances.service';
import { WorkflowInstancesController } from './instances/workflow-instances.controller';

import { StateMachineService } from './state-machine/state-machine.service';

import { SandboxService } from './sandbox/sandbox.service';
import { RuleEngineService } from './rule-engine/rule-engine.service';
import { DecisionEngineService } from './decision-engine/decision-engine.service';

import { TaskEngineService } from './task-engine/task-engine.service';
import { TaskEngineController } from './task-engine/task-engine.controller';

import { ApprovalEngineService } from './approval-engine/approval-engine.service';
import { ApprovalEngineController } from './approval-engine/approval-engine.controller';

import { CompensationService } from './compensation/compensation.service';

import { SlaEngineService } from './sla-engine/sla-engine.service';
import { SlaEngineController } from './sla-engine/sla-engine.controller';

import { WebhookEngineService } from './webhook-engine/webhook-engine.service';
import { WebhookEngineController } from './webhook-engine/webhook-engine.controller';

import { WorkflowLookupController } from './lookups/workflow-lookup.controller';

@Module({
  imports: [EventBusModule],
  controllers: [
    WorkflowRegistryController,
    BpmnCompatController,
    WorkflowInstancesController,
    TaskEngineController,
    ApprovalEngineController,
    SlaEngineController,
    WebhookEngineController,
    WorkflowLookupController,
  ],
  providers: [WorkflowRegistryService,
    BpmnCompatService,
    WorkflowInstancesService,
    StateMachineService,
    SandboxService,
    RuleEngineService,
    DecisionEngineService,
    TaskEngineService,
    ApprovalEngineService,
    CompensationService,
    SlaEngineService,
    WebhookEngineService],
  exports: [
    WorkflowRegistryService,
    BpmnCompatService,
    WorkflowInstancesService,
    StateMachineService,
    SandboxService,
    RuleEngineService,
    DecisionEngineService,
    TaskEngineService,
    ApprovalEngineService,
    CompensationService,
    SlaEngineService,
    WebhookEngineService,
  ],
})
export class WorkflowFoundationModule {}
