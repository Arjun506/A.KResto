import { Test, TestingModule } from '@nestjs/testing';
import { AiPromptRegistryService } from './ai-prompt-registry.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AiPromptRegistryService', () => {
  let service: AiPromptRegistryService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      ai_prompts: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
      },
      ai_prompt_versions: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiPromptRegistryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AiPromptRegistryService>(AiPromptRegistryService);
  });

  it('should compile templates and substitute variables', async () => {
    prisma.ai_prompts.findUnique.mockResolvedValue({
      id: 'p_1',
      code: 'test-prompt',
      versions: [{ versionString: '1.0', templateText: 'Hello {{name}}' }],
    });

    const result = await service.compilePrompt('test-prompt', {
      name: 'World',
    });

    expect(prisma.ai_prompts.findUnique).toHaveBeenCalled();
    expect(result.compiledText).toEqual('Hello World');
  });
});
