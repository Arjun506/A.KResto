import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  CaseCreatedEvent,
  CaseEscalatedEvent,
} from '../../event-bus/events/crm.events';

@Injectable()
export class CrmCasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createCase(
    tenantId: string,
    customerId: string,
    caseType: string,
    title: string,
    description?: string,
  ) {
    const caseNumber = `CASE-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const caseRecord = await this.prisma.crm_cases.create({
      data: {
        tenantId,
        customerId,
        caseNumber,
        caseType,
        title,
        description,
        status: 'NEW',
      },
    });

    await this.eventBus.publish(
      new CaseCreatedEvent(
        caseRecord.id,
        { caseId: caseRecord.id, caseNumber },
        tenantId,
      ),
    );

    return caseRecord;
  }

  async escalateCase(id: string) {
    const caseRecord = await this.prisma.crm_cases.findUnique({
      where: { id },
    });
    if (!caseRecord) {
      throw new NotFoundException(`Case ${id} not found`);
    }

    const updated = await this.prisma.crm_cases.update({
      where: { id },
      data: { status: 'ESCALATED' },
    });

    await this.eventBus.publish(
      new CaseEscalatedEvent(
        id,
        { caseId: id, priority: 'HIGH' },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  async getCase(id: string) {
    return this.prisma.crm_cases.findUnique({ where: { id } });
  }

  async getCustomerCases(customerId: string) {
    return this.prisma.crm_cases.findMany({ where: { customerId } });
  }
}
