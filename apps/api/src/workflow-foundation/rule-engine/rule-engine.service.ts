import { Injectable } from '@nestjs/common';
import { SandboxService } from '../sandbox/sandbox.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { RuleExecutedEvent } from '../../event-bus/events/workflow.events';

@Injectable()
export class RuleEngineService {
  constructor(
    private readonly sandbox: SandboxService,
    private readonly eventBus: EventBusService,
  ) {}

  async evaluateRule(
    ruleCode: string,
    expression: string,
    context: Record<string, any>,
    tenantId?: string,
  ) {
    const result = await this.sandbox.evaluateExpression(expression, context);

    await this.eventBus.publish(
      new RuleExecutedEvent(
        ruleCode,
        { ruleCode, evaluationResult: result },
        tenantId,
      ),
    );

    return result;
  }
}
