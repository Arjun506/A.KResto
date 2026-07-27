import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { PromptExecutedEvent } from '../event-bus/events/ai-platform.events';

@Injectable()
export class AiGatewayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async executePrompt(tenantId: string, modelCode: string, promptText: string) {
    const model = await this.prisma.ai_models.findFirst({
      where: { name: modelCode, isActive: true },
    });

    const activeModel = model || {
      id: 'default_model_1',
      name: 'gemini-1.5-pro',
      provider: 'GEMINI',
    };

    // Simulate model request latency and generation output
    const start = Date.now();
    const mockOutput = `AI response from model ${activeModel.name}: Mocked classification parameters.`;
    const latency = Date.now() - start;

    // Log telemetry usage metrics
    if (model) {
      await this.prisma.ai_usage_metrics.create({
        data: {
          tenantId,
          modelId: activeModel.id,
          promptTokens: promptText.split(' ').length,
          completionTokens: mockOutput.split(' ').length,
          latencyMs: latency,
        },
      });
    }

    await this.eventBus.publish(
      new PromptExecutedEvent(
        activeModel.id,
        { promptCode: 'DYNAMIC_PROMPT', latencyMs: latency },
        tenantId,
      ),
    );

    return {
      output: mockOutput,
      modelUsed: activeModel.name,
      tokens: promptText.split(' ').length + mockOutput.split(' ').length,
      latencyMs: latency,
    };
  }

  async configureModel(provider: string, name: string) {
    return this.prisma.ai_models.create({
      data: {
        provider,
        name,
        isActive: true,
      },
    });
  }
}
