import { Test, TestingModule } from '@nestjs/testing';
import { AiGovernanceService } from './ai-governance.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AiGovernanceService', () => {
  let service: AiGovernanceService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      ai_guardrails: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiGovernanceService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AiGovernanceService>(AiGovernanceService);
  });

  it('should intercept inputs matching active guardrail rules', async () => {
    prisma.ai_guardrails.findMany.mockResolvedValue([
      { id: 'rule_1', type: 'PII', rulePattern: '\\b\\d{9}\\b' },
    ]);

    await expect(
      service.validateInputSafety('t_1', 'my SSN is 123456789'),
    ).rejects.toThrow();
  });
});
