import { Test, TestingModule } from '@nestjs/testing';
import { CustSearchService } from './cust-search.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

describe('CustSearchService', () => {
  let service: CustSearchService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      products: {
        findMany: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustSearchService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<CustSearchService>(CustSearchService);
  });

  it('should process keyword searches and log queries', async () => {
    prisma.products.findMany.mockResolvedValue([
      {
        id: '1',
        name: 'Pizza',
        sku: 'pizza_sku',
        status: 'ACTIVE',
        metadata: { price: 10 },
      },
    ]);

    const result = await service.searchCatalog('t_1', 'Pizza');

    expect(prisma.products.findMany).toHaveBeenCalled();
    expect(result.length).toEqual(1);
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
