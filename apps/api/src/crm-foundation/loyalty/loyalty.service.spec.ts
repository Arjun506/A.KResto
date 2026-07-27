import { Test, TestingModule } from '@nestjs/testing';
import { LoyaltyService } from './loyalty.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('LoyaltyService', () => {
  let service: LoyaltyService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      crm_loyalty: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      crm_loyalty_ledger: {
        create: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<LoyaltyService>(LoyaltyService);
  });

  it('should credit customer loyalty point ledgers and change tier', async () => {
    const mockLoyalty = {
      id: 'loyalty_1',
      customerId: 'cust_1',
      tier: 'BRONZE',
      pointsTotal: 100,
      tenantId: 't_1',
    };
    prisma.crm_loyalty.findUnique.mockResolvedValue(mockLoyalty);
    prisma.crm_loyalty.update.mockResolvedValue({
      ...mockLoyalty,
      pointsTotal: 600,
      tier: 'SILVER',
    });

    const result = await service.awardPoints(
      'loyalty_1',
      500,
      'ORDER_PURCHASE',
    );

    expect(prisma.crm_loyalty.update).toHaveBeenCalled();
    expect(prisma.crm_loyalty_ledger.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result.tier).toEqual('SILVER');
  });
});
