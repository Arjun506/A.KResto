import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  WorkflowStartedEvent,
  WorkflowCompletedEvent,
  WorkflowCancelledEvent,
} from '../../event-bus/events/workflow.events';

@Injectable()
export class WorkflowInstancesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async startInstance(
    workflowDefinitionId: string,
    variables: any,
    tenantId?: string,
  ) {
    const definition = await this.prisma.workflow_definitions.findUnique({
      where: { id: workflowDefinitionId },
    });
    if (!definition) {
      throw new NotFoundException(
        `Definition ${workflowDefinitionId} not found`,
      );
    }

    const code = `INST-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const instance = await this.prisma.workflow_instances.create({
      data: {
        tenantId,
        workflowDefinitionId,
        code,
        status: 'RUNNING',
        variables,
        currentStep: 'START',
      },
    });

    await this.eventBus.publish(
      new WorkflowStartedEvent(
        instance.id,
        { instanceId: instance.id, workflowId: workflowDefinitionId },
        tenantId,
      ),
    );

    return instance;
  }

  async cancelInstance(id: string, reason?: string) {
    const instance = await this.prisma.workflow_instances.update({
      where: { id },
      data: { status: 'CANCELLED', completedAt: new Date() },
    });

    await this.eventBus.publish(
      new WorkflowCancelledEvent(
        id,
        { instanceId: id, reason },
        instance.tenantId || undefined,
      ),
    );

    return instance;
  }

  async getInstance(id: string) {
    return this.prisma.workflow_instances.findUnique({
      where: { id },
      include: { approvals: true, tasks: true, timeline: true },
    });
  }
}
