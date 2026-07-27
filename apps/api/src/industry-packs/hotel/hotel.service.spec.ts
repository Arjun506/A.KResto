import { Test, TestingModule } from '@nestjs/testing';
import { HotelService } from './hotel.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('HotelService', () => {
  let service: HotelService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      hotel_properties: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      hotel_room_types: {
        create: jest.fn(),
      },
      hotel_rooms: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      hotel_bookings: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      hotel_housekeeping_tasks: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      hotel_maintenance_records: {
        create: jest.fn(),
      },
      hotel_digital_keys: {
        create: jest.fn(),
      },
      payment_transactions: {
        create: jest.fn(),
      },
      crm_loyalty: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<HotelService>(HotelService);
  });

  it('should confirm bookings and trigger checked-in and housekeeping flows', async () => {
    prisma.hotel_bookings.findUnique.mockResolvedValue({
      id: 'book_1',
      tenantId: 't_1',
      roomId: 'room_1',
      customerId: 'cust_1',
      status: 'CONFIRMED',
    });
    prisma.hotel_bookings.update.mockResolvedValue({
      id: 'book_1',
      tenantId: 't_1',
      status: 'CHECKED_IN',
    });
    prisma.hotel_rooms.update.mockResolvedValue({ id: 'room_1' });

    const checkIn = await service.checkIn('book_1');

    expect(prisma.hotel_bookings.update).toHaveBeenCalled();
    expect(checkIn.status).toEqual('CHECKED_IN');
    expect(eventBus.publish).toHaveBeenCalled();
  });

  it('should register properties, room classifications, and query occupancy analytics metrics', async () => {
    prisma.hotel_bookings.findMany.mockResolvedValue([{ id: 'book_1' }]);
    prisma.hotel_rooms.findMany.mockResolvedValue([
      { id: 'room_1' },
      { id: 'room_2' },
    ]);

    const analytics = await service.fetchOccupancyAnalytics('t_1');

    expect(analytics.occupancyRate).toEqual(50);
    expect(analytics.RevPAR).toEqual(92.75);
  });
});
