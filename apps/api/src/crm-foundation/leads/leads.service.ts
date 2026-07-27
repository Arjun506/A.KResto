import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCrmLeadDto } from './dto/create-lead.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  LeadCreatedEvent,
  LeadQualifiedEvent,
} from '../../event-bus/events/crm.events';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createLead(dto: CreateCrmLeadDto) {
    const existing = await this.prisma.crm_leads.findUnique({
      where: { leadNumber: dto.leadNumber },
    });
    if (existing) {
      throw new ConflictException(
        `Lead with number ${dto.leadNumber} already exists`,
      );
    }

    const lead = await this.prisma.crm_leads.create({
      data: {
        tenantId: dto.tenantId,
        businessId: dto.businessId,
        customerId: dto.customerId,
        leadNumber: dto.leadNumber,
        sourceString: dto.sourceString,
        status: dto.status || 'NEW',
        notesString: dto.notesString,
      },
    });

    await this.eventBus.publish(
      new LeadCreatedEvent(
        lead.id,
        { leadId: lead.id, leadNumber: lead.leadNumber },
        lead.tenantId || undefined,
      ),
    );

    return lead;
  }

  async qualifyLead(id: string, customerId: string) {
    const lead = await this.prisma.crm_leads.findUnique({ where: { id } });
    if (!lead) {
      throw new NotFoundException(`Lead ${id} not found`);
    }

    const updated = await this.prisma.crm_leads.update({
      where: { id },
      data: {
        status: 'QUALIFIED',
        customerId,
      },
    });

    await this.eventBus.publish(
      new LeadQualifiedEvent(
        id,
        { leadId: id, customerId },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  async getLead(id: string) {
    return this.prisma.crm_leads.findUnique({ where: { id } });
  }

  async listLeads(tenantId?: string) {
    const where = tenantId
      ? { tenantId, deletedAt: null }
      : { deletedAt: null };
    return this.prisma.crm_leads.findMany({ where });
  }
}
