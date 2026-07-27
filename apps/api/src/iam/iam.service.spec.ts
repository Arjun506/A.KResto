import { Test, TestingModule } from '@nestjs/testing';
import { IamService } from './iam.service';
import { IamRepository } from './iam.repository';
import { EventBusService } from '../event-bus/event-bus.service';

describe('IamService', () => {
  let service: IamService;
  let repository: Partial<IamRepository>;
  let eventBus: Partial<EventBusService>;

  beforeEach(async () => {
    repository = {
      findById: jest.fn().mockImplementation((id: string) => {
        if (id === 'user-1') {
          return Promise.resolve({
            id: 'user-1',
            email: 'test@akos.io',
            name: 'Test User',
            role: 'ADMIN',
            tenantId: 'tenant-1',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        return Promise.resolve(null);
      }),
      listUsers: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    };

    eventBus = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IamService,
        { provide: IamRepository, useValue: repository },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<IamService>(IamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user by id', async () => {
    const user = await service.getUserById('user-1');
    expect(user).toBeDefined();
    expect(user.id).toBe('user-1');
  });
});
