import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../event-bus/event-bus.service';
import { DecisionEvaluatedEvent } from '../../event-bus/events/workflow.events';

@Injectable()
export class DecisionEngineService {
  constructor(private readonly eventBus: EventBusService) {}

  async evaluateDecision(
    tableCode: string,
    inputs: Record<string, any>,
    tenantId?: string,
  ) {
    // Simple mock decision routing table lookup
    let output = { action: 'AUTO_APPROVE' };

    if (inputs.amount > 10000) {
      output = { action: 'ROUTE_TO_VP' };
    } else if (inputs.amount > 5000) {
      output = { action: 'ROUTE_TO_MANAGER' };
    }

    await this.eventBus.publish(
      new DecisionEvaluatedEvent(
        tableCode,
        { tableCode, decisionOutput: output },
        tenantId,
      ),
    );

    return output;
  }
}
