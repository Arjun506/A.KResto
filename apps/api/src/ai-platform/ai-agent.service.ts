import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import {
  AgentStartedEvent,
  AgentCompletedEvent,
} from '../event-bus/events/ai-platform.events';

@Injectable()
export class AiAgentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createAgent(tenantId: string, name: string, systemPrompt: string) {
    return this.prisma.ai_agents.create({
      data: {
        tenantId,
        name,
        systemPrompt,
      },
    });
  }

  async runAgentTask(tenantId: string, agentId: string, inputPayload: any) {
    const agent = await this.prisma.ai_agents.findUnique({
      where: { id: agentId },
    });
    if (!agent) {
      throw new NotFoundException(`AI Agent ${agentId} not found`);
    }

    const run = await this.prisma.ai_agent_runs.create({
      data: {
        agentId,
        tenantId,
        status: 'RUNNING',
      },
    });

    await this.eventBus.publish(
      new AgentStartedEvent(agentId, { agentId, runId: run.id }, tenantId),
    );

    // Simulate task execution cycles
    const updated = await this.prisma.ai_agent_runs.update({
      where: { id: run.id },
      data: {
        status: 'COMPLETED',
        tokensUsed: 120,
      },
    });

    await this.eventBus.publish(
      new AgentCompletedEvent(
        agentId,
        { agentId, runId: run.id, status: 'COMPLETED' },
        tenantId,
      ),
    );

    return updated;
  }

  async registerSkill(
    tenantId: string,
    code: string,
    name: string,
    config: any,
  ) {
    return this.prisma.ai_skills.create({
      data: {
        tenantId,
        code,
        name,
        configJson: config,
      },
    });
  }

  async registerTool(
    tenantId: string,
    code: string,
    name: string,
    schema: any,
  ) {
    return this.prisma.ai_tools.create({
      data: {
        tenantId,
        code,
        name,
        schemaJson: schema,
      },
    });
  }
}
