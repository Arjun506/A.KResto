import { Test, TestingModule } from '@nestjs/testing';
import { WarehousesService } from './warehouses.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('WarehousesService', () => {
  let service: WarehousesService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      warehouses: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehousesService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
  });

  it('should create a new warehouse facility & hierarchy', async () => {
    const dto = {
      code: 'WH-01',
      name: 'Main Hub',
      region: 'WEST',
    };

    const mockWh = { id: 'wh_1', ...dto, tenantId: 't_1' };
    prisma.warehouses.create.mockResolvedValue(mockWh);

    const result = await service.createWarehouse(dto);

    expect(prisma.warehouses.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result).toEqual(mockWh);
  });
});
