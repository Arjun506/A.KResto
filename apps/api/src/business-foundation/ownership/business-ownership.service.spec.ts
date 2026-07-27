import { Test, TestingModule } from '@nestjs/testing';
import { BusinessOwnershipService } from './business-ownership.service';
import { BusinessOwnershipRepository } from './business-ownership.repository';
import { EventBusService } from '../../event-bus/event-bus.service';
import { OwnershipRole } from '@prisma/client';

describe('BusinessOwnershipService', () => {
  let service: BusinessOwnershipService;

  beforeEach(async () => {
    const repo = {
      assignOwnership: jest
        .fn()
        .mockResolvedValue({ id: 'own-1', role: OwnershipRole.OWNER }),
      getCurrentOwners: jest.fn().mockResolvedValue([]),
      getOwnershipHistory: jest.fn().mockResolvedValue([]),
      unassignOwnership: jest.fn().mockResolvedValue({ count: 1 }),
    };

    const eventBus = { publish: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessOwnershipService,
        { provide: BusinessOwnershipRepository, useValue: repo },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<BusinessOwnershipService>(BusinessOwnershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should assign owner role to business', async () => {
    const res = await service.assignOwnership('biz-1', {
      userId: 'usr-1',
      role: OwnershipRole.OWNER,
    });
    expect(res).toBeDefined();
    expect(res.role).toBe(OwnershipRole.OWNER);
  });
});
