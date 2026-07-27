import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleCommandService } from './console-command.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

describe('ConsoleCommandService', () => {
  let service: ConsoleCommandService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      console_commands: {
        findFirst: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsoleCommandService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<ConsoleCommandService>(ConsoleCommandService);
  });

  it('should resolve and execute command triggers', async () => {
    prisma.console_commands.findFirst.mockResolvedValue({
      id: 'cmd_1',
      triggerPhrase: 'open KDS',
      actionEndpoint: '/kds',
    });

    const result = await service.executeCommand('t_1', 'user_1', 'open KDS');

    expect(prisma.console_commands.findFirst).toHaveBeenCalled();
    expect(result.executed).toBe(true);
    expect(result.actionEndpoint).toEqual('/kds');
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
