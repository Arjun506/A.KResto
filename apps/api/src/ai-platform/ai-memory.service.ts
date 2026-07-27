import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import {
  MemoryUpdatedEvent,
  ForecastCompletedEvent,
} from '../event-bus/events/ai-platform.events';

@Injectable()
export class AiMemoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async saveMemory(tenantId: string, customerId: string, text: string) {
    const memory = await this.prisma.ai_memories.create({
      data: {
        tenantId,
        customerId,
        memoryText: text,
      },
    });

    await this.eventBus.publish(
      new MemoryUpdatedEvent(
        customerId,
        { customerId, summarySnippet: text.slice(0, 30) },
        tenantId,
      ),
    );

    return memory;
  }

  // RAG Cosine similarity mock lookup pipeline
  async queryKnowledgeRag(tenantId: string, query: string) {
    const memories = await this.prisma.ai_memories.findMany({
      where: { tenantId },
      take: 5,
    });

    return memories.map((m) => ({
      text: m.memoryText,
      similarityScore: 0.88,
    }));
  }

  // Forecasting engine
  async forecastDemandMetric(tenantId: string, metricCode: string) {
    const forecastVal = 250.5;

    await this.eventBus.publish(
      new ForecastCompletedEvent(
        tenantId,
        { metricCode, valueForecasted: forecastVal },
        tenantId,
      ),
    );

    return {
      metricCode,
      forecastedValue: forecastVal,
      confidenceInterval: [230.0, 270.0],
    };
  }
}
