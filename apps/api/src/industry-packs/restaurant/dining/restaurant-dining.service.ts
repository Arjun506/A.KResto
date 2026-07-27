import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRestaurantTableDto } from './dto/create-table.dto';
import { CreateRestaurantReservationDto } from './dto/create-reservation.dto';
import { EventBusService } from '../../../event-bus/event-bus.service';
import {
  KitchenTicketCreatedEvent,
  KitchenTicketCompletedEvent,
  TableStatusChangedEvent,
  ReservationConfirmedEvent,
} from '../../../event-bus/events/restaurant.events';

@Injectable()
export class RestaurantDiningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  // Table Management & Sessions
  async createTable(tenantId: string, dto: CreateRestaurantTableDto) {
    return this.prisma.rest_tables.create({
      data: {
        tenantId,
        tableNumber: dto.tableNumber,
        seatingCapacity: dto.seatingCapacity,
        zone: dto.zone,
        status: 'AVAILABLE',
      },
    });
  }

  async updateTableStatus(tableId: string, status: string) {
    const table = await this.prisma.rest_tables.findUnique({
      where: { id: tableId },
    });
    if (!table) {
      throw new NotFoundException(`Table ${tableId} not found`);
    }

    const updated = await this.prisma.rest_tables.update({
      where: { id: tableId },
      data: { status },
    });

    await this.eventBus.publish(
      new TableStatusChangedEvent(
        tableId,
        {
          tableNumber: table.tableNumber,
          oldStatus: table.status,
          newStatus: status,
        },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  // Seating Reservations & Waitlist
  async createReservation(
    tenantId: string,
    dto: CreateRestaurantReservationDto,
  ) {
    const reservation = await this.prisma.rest_reservations.create({
      data: {
        tenantId,
        customerId: dto.customerId,
        tableId: dto.tableId,
        partySize: dto.partySize,
        reservedFor: new Date(dto.reservedFor),
        status: 'CONFIRMED',
      },
    });

    await this.eventBus.publish(
      new ReservationConfirmedEvent(
        reservation.id,
        { reservationId: reservation.id, customerId: dto.customerId },
        tenantId,
      ),
    );

    return reservation;
  }

  // KDS & Station Routing
  async createKitchenTicket(
    tenantId: string,
    orderId: string,
    station: string,
  ) {
    const ticket = await this.prisma.rest_kitchen_tickets.create({
      data: {
        tenantId,
        orderId,
        station,
        status: 'PENDING',
      },
    });

    await this.eventBus.publish(
      new KitchenTicketCreatedEvent(
        ticket.id,
        { ticketId: ticket.id, orderId, station },
        tenantId,
      ),
    );

    return ticket;
  }

  async completeKitchenTicket(ticketId: string) {
    const ticket = await this.prisma.rest_kitchen_tickets.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) {
      throw new NotFoundException(`Kitchen ticket ${ticketId} not found`);
    }

    const updated = await this.prisma.rest_kitchen_tickets.update({
      where: { id: ticketId },
      data: {
        status: 'READY',
        prepCompletedAt: new Date(),
      },
    });

    await this.eventBus.publish(
      new KitchenTicketCompletedEvent(
        ticketId,
        { ticketId, station: ticket.station },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  // Dining Sessions & Waitlist queues
  async listWaitlist(tenantId: string) {
    return [
      {
        id: 'wait_1',
        partyName: 'Smith Party of 4',
        queueNumber: 1,
        joinedAt: new Date(),
      },
    ];
  }
}
