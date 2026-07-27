import { Test, TestingModule } from '@nestjs/testing';
import { BusinessRegistryService } from './business-registry.service';
import { BusinessRegistryRepository } from './business-registry.repository';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';
import { BusinessStatus } from '@prisma/client';

describe('BusinessRegistryService', () => {
  let service: BusinessRegistryService;
  let repo: Partial<BusinessRegistryRepository>;

  beforeEach(async () => {
    repo = {
      create: jest.fn().mockImplementation((dto) =>
        Promise.resolve({
          id: 'biz-1',
          name: dto.name,
          status: BusinessStatus.DRAFT,
          tenantId: dto.tenantId,
        }),
      ),
      findById: jest.fn().mockImplementation((id: string) => {
        if (id === 'biz-1') {
          return Promise.resolve({
            id: 'biz-1',
            name: 'Apex Corp',
            status: BusinessStatus.DRAFT,
            tenantId: 't-1',
          });
        }
        return Promise.resolve(null);
      }),
      findDuplicates: jest.fn().mockResolvedValue([]),
      updateStatus: jest.fn().mockImplementation((id, status) =>
        Promise.resolve({
          id,
          status,
          isVerified: status === BusinessStatus.VERIFIED,
        }),
      ),
      softDelete: jest.fn().mockResolvedValue({ id: 'biz-1' }),
      recordTimeline: jest.fn().mockResolvedValue({ id: 'time-1' }),
      list: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    };

    const eventBus = { publish: jest.fn().mockResolvedValue(undefined) };
    const auditService = { logEvent: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessRegistryService,
        { provide: BusinessRegistryRepository, useValue: repo },
        { provide: EventBusService, useValue: eventBus },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<BusinessRegistryService>(BusinessRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new business entity', async () => {
    const res = await service.registerBusiness({
      name: 'Apex Corp',
      organizationId: 'org-1',
    });
    expect(res).toBeDefined();
    expect(res.id).toBe('biz-1');
    expect(repo.create).toHaveBeenCalled();
  });

  it('should transition business status in lifecycle state machine', async () => {
    const updated = await service.updateStatus(
      'biz-1',
      BusinessStatus.VERIFIED,
    );
    expect(updated.status).toBe(BusinessStatus.VERIFIED);
    expect(repo.updateStatus).toHaveBeenCalledWith(
      'biz-1',
      BusinessStatus.VERIFIED,
    );
  });
});
