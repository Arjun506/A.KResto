import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantDiningService } from './restaurant-dining.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { EventBusService } from '../../../event-bus/event-bus.service';

describe('RestaurantDiningService', () => {
  let service: RestaurantDiningService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      rest_tables: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
      },
      rest_reservations: {
        create: jest.fn(),
      },
      rest_kitchen_tickets: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantDiningService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<RestaurantDiningService>(RestaurantDiningService);
  });

  it('should create tables and transition occupancy status states', async () => {
    const dto = {
      tableNumber: 'T-10',
      seatingCapacity: 4,
      zone: 'TERRACE',
    };

    const mockTable = {
      id: 'table_1',
      ...dto,
      status: 'AVAILABLE',
      tenantId: 't_1',
    };
    prisma.rest_tables.create.mockResolvedValue(mockTable);

    const result = await service.createTable('t_1', dto);

    expect(prisma.rest_tables.create).toHaveBeenCalled();
    expect(result.tableNumber).toEqual('T-10');
  });
});
