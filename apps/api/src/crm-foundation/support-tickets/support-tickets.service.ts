import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupportTicketDto } from './dto/create-ticket.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  SupportTicketCreatedEvent,
  SupportTicketAssignedEvent,
  SupportTicketResolvedEvent,
} from '../../event-bus/events/crm.events';

@Injectable()
export class SupportTicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createTicket(dto: CreateSupportTicketDto) {
    const existing = await this.prisma.crm_tickets.findUnique({
      where: { ticketNumber: dto.ticketNumber },
    });
    if (existing) {
      throw new ConflictException(
        `Ticket number ${dto.ticketNumber} already registered`,
      );
    }

    const ticket = await this.prisma.crm_tickets.create({
      data: {
        tenantId: dto.tenantId,
        customerId: dto.customerId,
        ticketNumber: dto.ticketNumber,
        title: dto.title,
        description: dto.description,
        status: 'NEW',
        priority: dto.priority || 'NORMAL',
      },
    });

    await this.eventBus.publish(
      new SupportTicketCreatedEvent(
        ticket.id,
        { ticketId: ticket.id, ticketNumber: ticket.ticketNumber },
        ticket.tenantId || undefined,
      ),
    );

    return ticket;
  }

  async assignTicket(id: string, assignedTo: string) {
    const ticket = await this.prisma.crm_tickets.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }

    const updated = await this.prisma.crm_tickets.update({
      where: { id },
      data: {
        assignedTo,
        status: 'ASSIGNED',
      },
    });

    await this.eventBus.publish(
      new SupportTicketAssignedEvent(
        id,
        { ticketId: id, assignedTo },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  async resolveTicket(id: string) {
    const ticket = await this.prisma.crm_tickets.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }

    const updated = await this.prisma.crm_tickets.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    await this.eventBus.publish(
      new SupportTicketResolvedEvent(
        id,
        { ticketId: id },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  async getTicket(id: string) {
    return this.prisma.crm_tickets.findUnique({ where: { id } });
  }

  async listTickets(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    return this.prisma.crm_tickets.findMany({ where });
  }
}
