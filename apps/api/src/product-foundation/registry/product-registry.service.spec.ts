import { Test, TestingModule } from '@nestjs/testing';
import { ProductRegistryService } from './product-registry.service';
import { ProductRegistryRepository } from './product-registry.repository';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';
import { ProductStatus, ProductIdentityType } from '@prisma/client';

describe('ProductRegistryService', () => {
  let service: ProductRegistryService;
  let repo: Partial<ProductRegistryRepository>;

  beforeEach(async () => {
    repo = {
      create: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          id: 'prod-1',
          sku: dto.sku,
          name: dto.name,
          identityType: ProductIdentityType.PHYSICAL,
          status: ProductStatus.DRAFT,
          tenantId: dto.tenantId,
        }),
      ),
      findById: jest.fn().mockImplementation((id: string) => {
        if (id === 'prod-1') {
          return Promise.resolve({
            id: 'prod-1',
            sku: 'SKU-100',
            name: 'Sample Product',
            identityType: ProductIdentityType.PHYSICAL,
            status: ProductStatus.DRAFT,
            tenantId: 't-1',
          });
        }
        return Promise.resolve(null);
      }),
      updateStatus: jest
        .fn()
        .mockImplementation((id, status) => Promise.resolve({ id, status })),
      softDelete: jest.fn().mockResolvedValue({ id: 'prod-1' }),
      recordTimeline: jest.fn().mockResolvedValue({ id: 'time-1' }),
      list: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    };

    const eventBus = { publish: jest.fn().mockResolvedValue(undefined) };
    const auditService = { logEvent: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRegistryService,
        { provide: ProductRegistryRepository, useValue: repo },
        { provide: EventBusService, useValue: eventBus },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<ProductRegistryService>(ProductRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new product master record', async () => {
    const res = await service.createProduct({
      sku: 'SKU-100',
      name: 'Sample Product',
      slug: 'sample-product',
    });
    expect(res).toBeDefined();
    expect(res.id).toBe('prod-1');
    expect(repo.create).toHaveBeenCalled();
  });

  it('should update product status', async () => {
    const updated = await service.updateStatus('prod-1', ProductStatus.ACTIVE);
    expect(updated.status).toBe(ProductStatus.ACTIVE);
    expect(repo.updateStatus).toHaveBeenCalledWith(
      'prod-1',
      ProductStatus.ACTIVE,
      undefined,
    );
  });
});
