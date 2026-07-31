import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusModule } from '../event-bus/event-bus.module';

import { ConsoleWorkspaceService } from './console-workspace.service';
import { ConsoleCommandService } from './console-command.service';
import { ConsoleDashboardService } from './console-dashboard.service';
import { ConsoleNavigationService } from './console-navigation.service';
import { BusinessConsoleController } from './business-console.controller';

@Module({
  imports: [EventBusModule],
  controllers: [BusinessConsoleController],
  providers: [
    ConsoleWorkspaceService,
    ConsoleCommandService,
    ConsoleDashboardService,
    ConsoleNavigationService,
  ],
  exports: [
    ConsoleWorkspaceService,
    ConsoleCommandService,
    ConsoleDashboardService,
    ConsoleNavigationService,
  ],
})
export class BusinessConsoleModule {}
