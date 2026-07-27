import { Test, TestingModule } from '@nestjs/testing';
import { TaskEngineService } from './task-engine.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('TaskEngineService', () => {
  let service: TaskEngineService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      workflow_tasks: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskEngineService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<TaskEngineService>(TaskEngineService);
  });

  it('should create user tasks in inbox and fire events', async () => {
    const dto = {
      title: 'Manual Verification',
      description: 'Audit report',
      assignedTo: 'user_1',
    };

    const mockTask = {
      id: 'task_1',
      ...dto,
      status: 'ASSIGNED',
      tenantId: 't_1',
    };
    prisma.workflow_tasks.create.mockResolvedValue(mockTask);

    const result = await service.createTask(dto);

    expect(prisma.workflow_tasks.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result).toEqual(mockTask);
  });
});
