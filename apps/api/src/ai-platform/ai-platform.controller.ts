import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiGatewayService } from './ai-gateway.service';
import { AiPromptRegistryService } from './ai-prompt-registry.service';
import { AiAgentService } from './ai-agent.service';
import { AiMemoryService } from './ai-memory.service';
import { AiGovernanceService } from './ai-governance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('AI Platform & Automation Foundation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-platform')
export class AiPlatformController {
  constructor(
    private readonly gateway: AiGatewayService,
    private readonly prompts: AiPromptRegistryService,
    private readonly agents: AiAgentService,
    private readonly memory: AiMemoryService,
    private readonly governance: AiGovernanceService,
  ) {}

  @Post('gateway/execute')
  @ApiOperation({
    summary: 'Execute prompt templates using dynamic provider abstractions',
  })
  async executePrompt(
    @Body() body: { tenantId?: string; modelCode: string; promptText: string },
  ) {
    await this.governance.validateInputSafety(
      body.tenantId || 'GLOBAL',
      body.promptText,
    );
    return this.gateway.executePrompt(
      body.tenantId || 'GLOBAL',
      body.modelCode,
      body.promptText,
    );
  }

  @Post('prompts')
  @ApiOperation({ summary: 'Register prompt template configurations' })
  async registerPrompt(
    @Body()
    body: {
      tenantId?: string;
      code: string;
      name: string;
      templateText: string;
      version?: string;
    },
  ) {
    return this.prompts.registerPromptTemplate(
      body.tenantId || 'GLOBAL',
      body.code,
      body.name,
      body.templateText,
      body.version,
    );
  }

  @Post('agents')
  @ApiOperation({ summary: 'Register an intelligent agent executor' })
  async createAgent(
    @Body() body: { tenantId?: string; name: string; systemPrompt: string },
  ) {
    return this.agents.createAgent(
      body.tenantId || 'GLOBAL',
      body.name,
      body.systemPrompt,
    );
  }

  @Post('agents/:id/run')
  @ApiOperation({ summary: 'Dispatch stateful task execution to agent' })
  async runAgent(
    @Param('id') id: string,
    @Body() body: { tenantId?: string; payload: any },
  ) {
    return this.agents.runAgentTask(
      body.tenantId || 'GLOBAL',
      id,
      body.payload,
    );
  }

  @Post('memories')
  @ApiOperation({ summary: 'Save memories to tiered semantic databases' })
  async saveMemory(
    @Body() body: { tenantId?: string; customerId: string; text: string },
  ) {
    return this.memory.saveMemory(
      body.tenantId || 'GLOBAL',
      body.customerId,
      body.text,
    );
  }

  @Get('rag')
  @ApiOperation({
    summary:
      'Query semantic knowledge databases via RAG cosine similarity lookups',
  })
  async queryRag(
    @Query('tenantId') tenantId: string,
    @Query('query') query: string,
  ) {
    return this.memory.queryKnowledgeRag(tenantId || 'GLOBAL', query);
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Retrieve demand forecasts' })
  async getForecast(
    @Query('tenantId') tenantId: string,
    @Query('metricCode') metricCode: string,
  ) {
    return this.memory.forecastDemandMetric(tenantId || 'GLOBAL', metricCode);
  }

  @Post('guardrails')
  @ApiOperation({
    summary: 'Register PII and safety check guardrail rule regex parameters',
  })
  async createGuardrail(
    @Body() body: { tenantId?: string; type: string; pattern: string },
  ) {
    return this.governance.createGuardrailRule(
      body.tenantId || 'GLOBAL',
      body.type,
      body.pattern,
    );
  }
}
