import { Test, TestingModule } from '@nestjs/testing';
import { PriceCalculationService } from './price-calculation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('PriceCalculationService', () => {
  let service: PriceCalculationService;

  beforeEach(async () => {
    const prisma = {
      products: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'prod-1',
          prices: [{ priceType: 'BASE', amount: 150.0 }],
        }),
      },
      customer_prices: { findFirst: jest.fn().mockResolvedValue(null) },
      business_prices: { findFirst: jest.fn().mockResolvedValue(null) },
      tier_prices: { findFirst: jest.fn().mockResolvedValue(null) },
    };

    const eventBus = { publish: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceCalculationService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<PriceCalculationService>(PriceCalculationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate base product price', async () => {
    const res = await service.calculatePrice({
      productId: 'prod-1',
      quantity: 2,
    });
    expect(res).toBeDefined();
    expect(res.unitPrice).toBe(150.0);
    expect(res.totalPrice).toBe(300.0);
  });
});
