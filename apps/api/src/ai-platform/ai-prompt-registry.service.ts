import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiPromptRegistryService {
  constructor(private readonly prisma: PrismaService) {}

  async registerPromptTemplate(
    tenantId: string,
    code: string,
    name: string,
    templateText: string,
    version = '1.0.0',
  ) {
    const prompt = await this.prisma.ai_prompts.upsert({
      where: { code },
      update: { name },
      create: { tenantId, code, name },
    });

    await this.prisma.ai_prompt_versions.create({
      data: {
        promptId: prompt.id,
        versionString: version,
        templateText,
      },
    });

    return prompt;
  }

  async compilePrompt(code: string, variables: Record<string, string>) {
    const prompt = await this.prisma.ai_prompts.findUnique({
      where: { code },
      include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!prompt || prompt.versions.length === 0) {
      throw new NotFoundException(`Prompt template ${code} not found`);
    }

    let compiled = prompt.versions[0].templateText;
    Object.entries(variables).forEach(([key, val]) => {
      compiled = compiled.replace(new RegExp(`{{${key}}}`, 'g'), val);
    });

    return {
      code,
      version: prompt.versions[0].versionString,
      compiledText: compiled,
    };
  }
}
