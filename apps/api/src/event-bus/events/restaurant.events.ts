import { DomainEvent } from '../domain-event.interface';

export class RestaurantOrderPlacedEvent implements DomainEvent<{
  orderId: string;
  tableNumber?: string;
}> {
  readonly eventName = 'restaurant.order.placed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { orderId: string; tableNumber?: string },
    public readonly tenantId?: string,
  ) {}
}

export class KitchenTicketCreatedEvent implements DomainEvent<{
  ticketId: string;
  orderId: string;
  station: string;
}> {
  readonly eventName = 'restaurant.kitchen.ticket.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      ticketId: string;
      orderId: string;
      station: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class KitchenTicketCompletedEvent implements DomainEvent<{
  ticketId: string;
  station: string;
}> {
  readonly eventName = 'restaurant.kitchen.ticket.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { ticketId: string; station: string },
    public readonly tenantId?: string,
  ) {}
}

export class TableStatusChangedEvent implements DomainEvent<{
  tableNumber: string;
  oldStatus: string;
  newStatus: string;
}> {
  readonly eventName = 'restaurant.table.status.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      tableNumber: string;
      oldStatus: string;
      newStatus: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ReservationConfirmedEvent implements DomainEvent<{
  reservationId: string;
  customerId?: string;
}> {
  readonly eventName = 'restaurant.reservation.confirmed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { reservationId: string; customerId?: string },
    public readonly tenantId?: string,
  ) {}
}

export class ShiftStartedEvent implements DomainEvent<{
  shiftId: string;
  employeeId: string;
}> {
  readonly eventName = 'restaurant.shift.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { shiftId: string; employeeId: string },
    public readonly tenantId?: string,
  ) {}
}
