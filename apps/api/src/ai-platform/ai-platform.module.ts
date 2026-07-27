import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusModule } from '../event-bus/event-bus.module';

import { AiGatewayService } from './ai-gateway.service';
import { AiPromptRegistryService } from './ai-prompt-registry.service';
import { AiAgentService } from './ai-agent.service';
import { AiMemoryService } from './ai-memory.service';
import { AiGovernanceService } from './ai-governance.service';
import { AiPlatformController } from './ai-platform.controller';

@Module({
  imports: [EventBusModule],
  controllers: [AiPlatformController],
  providers: [
    PrismaService,
    AiGatewayService,
    AiPromptRegistryService,
    AiAgentService,
    AiMemoryService,
    AiGovernanceService,
  ],
  exports: [
    AiGatewayService,
    AiPromptRegistryService,
    AiAgentService,
    AiMemoryService,
    AiGovernanceService,
  ],
})
export class AiPlatformModule {}
