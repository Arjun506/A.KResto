import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRegistryService } from './customer-registry.service';
import { CustomerRegistryRepository } from './customer-registry.repository';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';
import {
  CustomerStatus,
  CustomerLifecycleStage,
  CustomerIdentityType,
} from '@prisma/client';

describe('CustomerRegistryService', () => {
  let service: CustomerRegistryService;
  let repo: Partial<CustomerRegistryRepository>;

  beforeEach(async () => {
    repo = {
      create: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          id: 'cust-1',
          customerCode: 'CUST-100',
          identityType: CustomerIdentityType.REGISTERED,
          lifecycleStage: CustomerLifecycleStage.PROSPECT,
          status: CustomerStatus.ACTIVE,
          tenantId: dto.tenantId,
        }),
      ),
      findById: jest.fn().mockImplementation((id: string) => {
        if (id === 'cust-1' || id === 'cust-2') {
          return Promise.resolve({
            id,
            customerCode: `CUST-${id}`,
            identityType: CustomerIdentityType.REGISTERED,
            lifecycleStage: CustomerLifecycleStage.ACTIVE,
            status: CustomerStatus.ACTIVE,
            tenantId: 't-1',
          });
        }
        return Promise.resolve(null);
      }),
      findDuplicates: jest.fn().mockResolvedValue([]),
      updateStatus: jest
        .fn()
        .mockImplementation((id, status) => Promise.resolve({ id, status })),
      updateLifecycleStage: jest
        .fn()
        .mockImplementation((id, lifecycleStage) =>
          Promise.resolve({ id, lifecycleStage }),
        ),
      mergeCustomers: jest
        .fn()
        .mockResolvedValue({ id: 'cust-1', status: CustomerStatus.CLOSED }),
      softDelete: jest.fn().mockResolvedValue({ id: 'cust-1' }),
      recordTimeline: jest.fn().mockResolvedValue({ id: 'time-1' }),
      list: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    };

    const eventBus = { publish: jest.fn().mockResolvedValue(undefined) };
    const auditService = { logEvent: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRegistryService,
        { provide: CustomerRegistryRepository, useValue: repo },
        { provide: EventBusService, useValue: eventBus },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<CustomerRegistryService>(CustomerRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new customer record', async () => {
    const res = await service.registerCustomer({
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(res).toBeDefined();
    expect(res.id).toBe('cust-1');
    expect(repo.create).toHaveBeenCalled();
  });

  it('should transition customer lifecycle stage', async () => {
    const updated = await service.updateLifecycleStage(
      'cust-1',
      CustomerLifecycleStage.ACTIVE,
    );
    expect(updated.lifecycleStage).toBe(CustomerLifecycleStage.ACTIVE);
    expect(repo.updateLifecycleStage).toHaveBeenCalledWith(
      'cust-1',
      CustomerLifecycleStage.ACTIVE,
      undefined,
    );
  });

  it('should merge source customer into target customer', async () => {
    const merged = await service.mergeCustomers(
      'cust-1',
      'cust-2',
      'usr-1',
      'Consolidate duplicate',
    );
    expect(merged.status).toBe(CustomerStatus.CLOSED);
    expect(repo.mergeCustomers).toHaveBeenCalledWith(
      'cust-1',
      'cust-2',
      'usr-1',
      'Consolidate duplicate',
    );
  });
});
