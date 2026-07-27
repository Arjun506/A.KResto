import { Test, TestingModule } from '@nestjs/testing';
import { AiGatewayService } from './ai-gateway.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

describe('AiGatewayService', () => {
  let service: AiGatewayService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      ai_models: {
        findFirst: jest.fn(),
      },
      ai_usage_metrics: {
        create: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiGatewayService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<AiGatewayService>(AiGatewayService);
  });

  it('should execute prompts and route to active model provider', async () => {
    prisma.ai_models.findFirst.mockResolvedValue({
      id: 'mod_1',
      name: 'gemini-pro',
      isActive: true,
    });
    prisma.ai_usage_metrics.create.mockResolvedValue({});

    const result = await service.executePrompt('t_1', 'gemini-pro', 'Hello AI');

    expect(prisma.ai_models.findFirst).toHaveBeenCalled();
    expect(result.output).toBeDefined();
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
