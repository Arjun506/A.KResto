import { Test, TestingModule } from '@nestjs/testing';
import { StockMovementsService } from './stock-movements.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { StockMovementType } from '@prisma/client';

describe('StockMovementsService', () => {
  let service: StockMovementsService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      stock_movements: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      stock_levels: {
        upsert: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockMovementsService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<StockMovementsService>(StockMovementsService);
  });

  it('should record a stock receipt movement and update level balance', async () => {
    const dto = {
      inventoryItemId: 'inv_1',
      warehouseId: 'wh_1',
      type: StockMovementType.RECEIPT,
      quantity: 50,
      unitCost: 10,
    };

    const mockMovement = { id: 'mov_1', ...dto, totalCost: 500 };
    prisma.stock_movements.create.mockResolvedValue(mockMovement);
    prisma.stock_levels.upsert.mockResolvedValue({});

    const result = await service.recordMovement(dto, 'user_1');

    expect(prisma.stock_movements.create).toHaveBeenCalled();
    expect(prisma.stock_levels.upsert).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result).toEqual(mockMovement);
  });
});
