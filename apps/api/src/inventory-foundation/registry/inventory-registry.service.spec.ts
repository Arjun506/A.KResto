import { Test, TestingModule } from '@nestjs/testing';
import { InventoryRegistryService } from './inventory-registry.service';
import { InventoryRegistryRepository } from './inventory-registry.repository';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';

describe('InventoryRegistryService', () => {
  let service: InventoryRegistryService;
  let repo: Partial<Record<keyof InventoryRegistryRepository, jest.Mock>>;
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

    eventBus = {
      publish: jest.fn(),
    };

    auditService = {
      logEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryRegistryService,
        { provide: InventoryRegistryRepository, useValue: repo },
        { provide: EventBusService, useValue: eventBus },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<InventoryRegistryService>(InventoryRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new master stock inventory item', async () => {
    const dto = {
      productId: 'prod_1',
      sku: 'SKU-TEST-01',
      name: 'Test Stock Item',
    };

    const mockItem = { id: 'inv_1', ...dto, tenantId: 't_1' };
    repo.create.mockResolvedValue(mockItem);

    const result = await service.createInventoryItem(dto, 'user_1');

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(eventBus.publish).toHaveBeenCalled();
    expect(auditService.logEvent).toHaveBeenCalled();
    expect(result).toEqual(mockItem);
  });
});
