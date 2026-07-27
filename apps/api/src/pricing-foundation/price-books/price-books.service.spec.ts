import { Test, TestingModule } from '@nestjs/testing';
import { PriceBooksService } from './price-books.service';
import { PriceBooksRepository } from './price-books.repository';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';
import { PriceBookStatus, PricingWorkflowStatus } from '@prisma/client';

describe('PriceBooksService', () => {
  let service: PriceBooksService;

  beforeEach(async () => {
    const repo = {
      create: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          id: 'pb-1',
          code: dto.code,
          name: dto.name,
          status: PriceBookStatus.ACTIVE,
          workflowStatus: PricingWorkflowStatus.DRAFT,
          tenantId: dto.tenantId,
        }),
      ),
      findById: jest.fn().mockImplementation((id: string) => {
        if (id === 'pb-1') {
          return Promise.resolve({
            id: 'pb-1',
            code: 'PB-STD',
            name: 'Standard Price Book',
            status: PriceBookStatus.ACTIVE,
          });
        }
        return Promise.resolve(null);
      }),
      softDelete: jest.fn().mockResolvedValue({ id: 'pb-1' }),
      recordTimeline: jest.fn().mockResolvedValue({ id: 'time-1' }),
      list: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    };

    const eventBus = { publish: jest.fn().mockResolvedValue(undefined) };
    const auditService = { logEvent: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceBooksService,
        { provide: PriceBooksRepository, useValue: repo },
        { provide: EventBusService, useValue: eventBus },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<PriceBooksService>(PriceBooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new master price book', async () => {
    const res = await service.createPriceBook({
      code: 'PB-STD',
      name: 'Standard Price Book',
    });
    expect(res).toBeDefined();
    expect(res.id).toBe('pb-1');
  });
});
