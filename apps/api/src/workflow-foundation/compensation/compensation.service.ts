import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  CompensationStartedEvent,
  CompensationCompletedEvent,
} from '../../event-bus/events/workflow.events';

@Injectable()
export class CompensationService {
  constructor(private readonly eventBus: EventBusService) {}

  async triggerCompensation(
    instanceId: string,
    failedStepName: string,
    tenantId?: string,
  ) {
    await this.eventBus.publish(
      new CompensationStartedEvent(
        instanceId,
        { instanceId, rollbackStep: failedStepName },
        tenantId,
      ),
    );

    // Run mock compensation rollback handlers
    const rollbackAction = `ROLLBACK_ACTION_FOR_${failedStepName}`;

    await this.eventBus.publish(
      new CompensationCompletedEvent(
        instanceId,
        { instanceId, rollbackStep: failedStepName },
        tenantId,
      ),
    );

    return {
      instanceId,
      failedStepName,
      compensationStatus: 'SUCCESS',
      executedAction: rollbackAction,
    };
  }
}
