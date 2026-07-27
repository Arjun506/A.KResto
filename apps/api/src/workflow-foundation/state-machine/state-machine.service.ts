import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  StateChangedEvent,
  ParallelBranchStartedEvent,
  ParallelBranchCompletedEvent,
} from '../../event-bus/events/workflow.events';

@Injectable()
export class StateMachineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async executeStep(instanceId: string, stepName: string, variables: any) {
    const instance = await this.prisma.workflow_instances.findUnique({
      where: { id: instanceId },
    });
    if (!instance) {
      throw new NotFoundException(`Workflow instance ${instanceId} not found`);
    }

    const previousStep = instance.currentStep || 'START';

    // Update instance state variables and current step
    const updated = await this.prisma.workflow_instances.update({
      where: { id: instanceId },
      data: {
        currentStep: stepName,
        variables,
      },
    });

    await this.eventBus.publish(
      new StateChangedEvent(
        instanceId,
        { previousState: previousStep, newState: stepName },
        instance.tenantId || undefined,
      ),
    );

    // Dynamic parallel simulation hooks
    if (stepName.includes('PARALLEL')) {
      await this.eventBus.publish(
        new ParallelBranchStartedEvent(instanceId, {
          instanceId,
          branchName: 'Branch_A',
        }),
      );
      await this.eventBus.publish(
        new ParallelBranchCompletedEvent(instanceId, {
          instanceId,
          branchName: 'Branch_A',
        }),
      );
    }

    return updated;
  }

  // AI path recommendation hook point
  async getPathRecommendation(instanceId: string) {
    return {
      instanceId,
      recommendedPath: ['Step_A', 'Step_B', 'Approval_Step'],
      confidenceScore: 0.94,
    };
  }
}
