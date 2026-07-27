import { Test, TestingModule } from '@nestjs/testing';
import { AiMemoryService } from './ai-memory.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

describe('AiMemoryService', () => {
  let service: AiMemoryService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      ai_memories: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiMemoryService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<AiMemoryService>(AiMemoryService);
  });

  it('should save memories and query dynamic RAG pipelines', async () => {
    prisma.ai_memories.create.mockResolvedValue({
      id: 'mem_1',
      memoryText: 'likes burger',
    });
    prisma.ai_memories.findMany.mockResolvedValue([
      { memoryText: 'likes burger' },
    ]);

    const result = await service.saveMemory('t_1', 'cust_1', 'likes burger');
    const rag = await service.queryKnowledgeRag('t_1', 'likes burger');

    expect(prisma.ai_memories.create).toHaveBeenCalled();
    expect(result.memoryText).toEqual('likes burger');
    expect(rag.length).toBeGreaterThan(0);
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
