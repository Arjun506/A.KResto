import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  SLAExceededEvent,
  EscalationTriggeredEvent,
} from '../../event-bus/events/workflow.events';

@Injectable()
export class SlaEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async configureSla(
    tenantId: string,
    referenceType: string,
    referenceId: string,
    minutesToComplete: number,
  ) {
    const dueDate = new Date();
    dueDate.setMinutes(dueDate.getMinutes() + minutesToComplete);

    return this.prisma.workflow_slas.create({
      data: {
        tenantId,
        referenceType,
        referenceId,
        dueDate,
        targetCompletionAt: dueDate,
      },
    });
  }

  async checkBreachedSlas() {
    const breached = await this.prisma.workflow_slas.findMany({
      where: {
        dueDate: { lte: new Date() },
        isEscalated: false,
      },
    });

    for (const sla of breached) {
      await this.prisma.workflow_slas.update({
        where: { id: sla.id },
        data: {
          isEscalated: true,
          escalatedAt: new Date(),
        },
      });

      await this.eventBus.publish(
        new SLAExceededEvent(
          sla.id,
          { referenceId: sla.referenceId, targetDueDate: sla.dueDate },
          sla.tenantId || undefined,
        ),
      );

      await this.eventBus.publish(
        new EscalationTriggeredEvent(
          sla.id,
          { referenceId: sla.referenceId },
          sla.tenantId || undefined,
        ),
      );
    }

    return { evaluated: breached.length };
  }

  async getSlas(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    return this.prisma.workflow_slas.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });
  }
}
