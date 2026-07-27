import { DomainEvent } from '../domain-event.interface';

export class HotelBookingConfirmedEvent implements DomainEvent<{
  bookingId: string;
  customerId?: string;
  roomId: string;
}> {
  readonly eventName = 'hotel.booking.confirmed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      bookingId: string;
      customerId?: string;
      roomId: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class GuestCheckedInEvent implements DomainEvent<{
  bookingId: string;
  roomId: string;
}> {
  readonly eventName = 'hotel.guest.checkedin';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { bookingId: string; roomId: string },
    public readonly tenantId?: string,
  ) {}
}

export class GuestCheckedOutEvent implements DomainEvent<{
  bookingId: string;
  roomId: string;
  outstandingAmount: number;
}> {
  readonly eventName = 'hotel.guest.checkedout';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      bookingId: string;
      roomId: string;
      outstandingAmount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class RoomStatusChangedEvent implements DomainEvent<{
  roomId: string;
  oldStatus: string;
  newStatus: string;
}> {
  readonly eventName = 'hotel.room.status.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      roomId: string;
      oldStatus: string;
      newStatus: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class HousekeepingCompletedEvent implements DomainEvent<{
  taskId: string;
  roomId: string;
  assignedEmployeeId?: string;
}> {
  readonly eventName = 'hotel.housekeeping.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      taskId: string;
      roomId: string;
      assignedEmployeeId?: string;
    },
    public readonly tenantId?: string,
  ) {}
}
