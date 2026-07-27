import { Test, TestingModule } from '@nestjs/testing';
import { CustomerConsentService } from './customer-consent.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ConsentType } from '@prisma/client';

describe('CustomerConsentService', () => {
  let service: CustomerConsentService;

  beforeEach(async () => {
    const prisma = {
      customer_consents: {
        create: jest.fn().mockImplementation((args) =>
          Promise.resolve({
            id: 'con-1',
            ...args.data,
          }),
        ),
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const eventBus = { publish: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerConsentService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<CustomerConsentService>(CustomerConsentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should record customer consent update', async () => {
    const res = await service.updateConsent('cust-1', {
      type: ConsentType.MARKETING,
      isGranted: true,
      version: '1.0',
    });
    expect(res).toBeDefined();
    expect(res.isGranted).toBe(true);
  });
});
