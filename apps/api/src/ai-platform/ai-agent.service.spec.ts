import { Test, TestingModule } from '@nestjs/testing';
import { AiAgentService } from './ai-agent.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

describe('AiAgentService', () => {
  let service: AiAgentService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      ai_agents: {
        findUnique: jest.fn(),
      },
      ai_agent_runs: {
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiAgentService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<AiAgentService>(AiAgentService);
  });

  it('should run stateful agent tasks and update execution status', async () => {
    prisma.ai_agents.findUnique.mockResolvedValue({
      id: 'agent_1',
      name: 'Task Agent',
    });
    prisma.ai_agent_runs.create.mockResolvedValue({ id: 'run_1' });
    prisma.ai_agent_runs.update.mockResolvedValue({
      id: 'run_1',
      status: 'COMPLETED',
    });

    const result = await service.runAgentTask('t_1', 'agent_1', {});

    expect(prisma.ai_agent_runs.create).toHaveBeenCalled();
    expect(prisma.ai_agent_runs.update).toHaveBeenCalled();
    expect(result.status).toEqual('COMPLETED');
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
