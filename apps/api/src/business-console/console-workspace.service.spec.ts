import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleWorkspaceService } from './console-workspace.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

describe('ConsoleWorkspaceService', () => {
  let service: ConsoleWorkspaceService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      console_workspaces: {
        findUnique: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsoleWorkspaceService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<ConsoleWorkspaceService>(ConsoleWorkspaceService);
  });

  it('should switch active workspace profiles and record session history', async () => {
    prisma.console_workspaces.findUnique.mockResolvedValue({
      id: 'work_1',
      code: 'rest-workspace',
      name: 'Restaurant Operations',
    });

    const result = await service.switchWorkspace(
      't_1',
      'user_1',
      'rest-workspace',
    );

    expect(prisma.console_workspaces.findUnique).toHaveBeenCalled();
    expect(result.workspace.code).toEqual('rest-workspace');
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
