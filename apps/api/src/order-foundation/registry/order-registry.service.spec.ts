import { Test, TestingModule } from '@nestjs/testing';
import { OrderRegistryService } from './order-registry.service';
import { OrderRegistryRepository } from './order-registry.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';

describe('OrderRegistryService', () => {
  let service: OrderRegistryService;
  let repo: Partial<Record<keyof OrderRegistryRepository, jest.Mock>>;
  let prisma: any;
  let eventBus: Partial<Record<keyof EventBusService, jest.Mock>>;
  let auditService: Partial<Record<keyof AuditService, jest.Mock>>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      findById: jest.fn(),
      list: jest.fn(),
      softDelete: jest.fn(),
      recordTimeline: jest.fn(),
    };

    prisma = {
      order_calculation_snapshots: {
        create: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    auditService = {
      logEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRegistryService,
        { provide: OrderRegistryRepository, useValue: repo },
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<OrderRegistryService>(OrderRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new master order record with line items and calculation snapshot', async () => {
    const dto = {
      orderNumber: 'ORD-TEST-01',
      lineItems: [
        {
          productId: 'prod_1',
          sku: 'SKU-01',
          name: 'Item 1',
          quantity: 2,
          unitPrice: 100,
        },
      ],
    };

    const mockOrder = {
      id: 'ord_1',
      orderNumber: 'ORD-TEST-01',
      currency: 'USD',
      grandTotal: 200,
      tenantId: 't_1',
      items: dto.lineItems,
    };
    repo.create.mockResolvedValue(mockOrder);
    prisma.order_calculation_snapshots.create.mockResolvedValue({});

    const result = await service.createOrder(dto, 'user_1');

    expect(repo.create).toHaveBeenCalled();
    expect(prisma.order_calculation_snapshots.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(auditService.logEvent).toHaveBeenCalled();
    expect(result).toEqual(mockOrder);
  });
});
