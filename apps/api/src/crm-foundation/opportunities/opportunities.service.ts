import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCrmOpportunityDto } from './dto/create-opportunity.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  OpportunityCreatedEvent,
  OpportunityWonEvent,
  OpportunityLostEvent,
} from '../../event-bus/events/crm.events';

@Injectable()
export class OpportunitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createOpportunity(dto: CreateCrmOpportunityDto) {
    const opp = await this.prisma.crm_opportunities.create({
      data: {
        tenantId: dto.tenantId,
        leadId: dto.leadId,
        customerId: dto.customerId,
        title: dto.title,
        stage: dto.stage || 'PROSPECTING',
        estimatedValue: dto.estimatedValue || 0,
        probability: dto.probability || 0,
      },
    });

    await this.eventBus.publish(
      new OpportunityCreatedEvent(
        opp.id,
        { opportunityId: opp.id, title: opp.title },
        opp.tenantId || undefined,
      ),
    );

    return opp;
  }

  async updateStage(id: string, stage: string, probability?: number) {
    const opp = await this.prisma.crm_opportunities.findUnique({
      where: { id },
    });
    if (!opp) {
      throw new NotFoundException(`Opportunity ${id} not found`);
    }

    const nextProb =
      probability !== undefined
        ? probability
        : stage === 'WON'
          ? 1.0
          : stage === 'LOST'
            ? 0.0
            : opp.probability;

    const updated = await this.prisma.crm_opportunities.update({
      where: { id },
      data: {
        stage,
        probability: nextProb,
        closedAt: stage === 'WON' || stage === 'LOST' ? new Date() : null,
      },
    });

    if (stage === 'WON') {
      await this.eventBus.publish(
        new OpportunityWonEvent(
          id,
          { opportunityId: id, estimatedValue: updated.estimatedValue },
          updated.tenantId || undefined,
        ),
      );
    } else if (stage === 'LOST') {
      await this.eventBus.publish(
        new OpportunityLostEvent(
          id,
          { opportunityId: id, reason: 'Lost to competitor' },
          updated.tenantId || undefined,
        ),
      );
    }

    return updated;
  }

  async getOpportunity(id: string) {
    return this.prisma.crm_opportunities.findUnique({ where: { id } });
  }

  async listOpportunities(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    return this.prisma.crm_opportunities.findMany({ where });
  }
}
