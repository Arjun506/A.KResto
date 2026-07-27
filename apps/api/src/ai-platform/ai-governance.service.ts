import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiGovernanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createGuardrailRule(tenantId: string, type: string, pattern: string) {
    return this.prisma.ai_guardrails.create({
      data: {
        tenantId,
        type,
        rulePattern: pattern,
      },
    });
  }

  async validateInputSafety(tenantId: string, text: string): Promise<boolean> {
    const rules = await this.prisma.ai_guardrails.findMany({
      where: { tenantId },
    });

    for (const rule of rules) {
      const regex = new RegExp(rule.rulePattern, 'i');
      if (regex.test(text)) {
        throw new BadRequestException(
          `Input fails guardrail safety checks for type: ${rule.type}`,
        );
      }
    }

    return true;
  }
}
