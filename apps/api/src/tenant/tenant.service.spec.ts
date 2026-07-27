import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { TenantRepository } from './tenant.repository';
import { EventBusService } from '../event-bus/event-bus.service';

describe('TenantService', () => {
  let service: TenantService;

  beforeEach(async () => {
    const repository = {
      findById: jest.fn().mockImplementation((id: string) => {
        if (id === 'tenant-1') {
          return Promise.resolve({
            id: 'tenant-1',
            name: 'Tenant One',
            slug: 'tenant-one',
            isActive: true,
          });
        }
        return Promise.resolve(null);
      }),
      listTenants: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    };

    const eventBus = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        { provide: TenantRepository, useValue: repository },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return tenant by id', async () => {
    const tenant = await service.getTenantById('tenant-1');
    expect(tenant).toBeDefined();
    expect(tenant.slug).toBe('tenant-one');
  });
});
