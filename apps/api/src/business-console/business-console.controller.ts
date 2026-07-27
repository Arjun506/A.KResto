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
import { ConsoleWorkspaceService } from './console-workspace.service';
import { ConsoleCommandService } from './console-command.service';
import { ConsoleDashboardService } from './console-dashboard.service';
import { ConsoleNavigationService } from './console-navigation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Universal Business Operating Console')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('business-console')
export class BusinessConsoleController {
  constructor(
    private readonly workspace: ConsoleWorkspaceService,
    private readonly command: ConsoleCommandService,
    private readonly dashboard: ConsoleDashboardService,
    private readonly navigation: ConsoleNavigationService,
  ) {}

  @Get('sidebar')
  @ApiOperation({
    summary: 'Compile sidebar layouts based on active registrations',
  })
  async getSidebar(@Query('tenantId') tenantId: string) {
    return this.navigation.compileSidebarNavigation(tenantId || 'GLOBAL');
  }

  @Post('switch')
  @ApiOperation({ summary: 'Switch active console workspace scopes' })
  async switchWorkspace(
    @Body() body: { tenantId?: string; userId: string; workspaceCode: string },
  ) {
    return this.workspace.switchWorkspace(
      body.tenantId || 'GLOBAL',
      body.userId,
      body.workspaceCode,
    );
  }

  @Post('commands')
  @ApiOperation({ summary: 'Register command palette triggers' })
  async registerCommand(
    @Body()
    body: {
      triggerPhrase: string;
      actionEndpoint: string;
      packId?: string;
    },
  ) {
    return this.command.registerCommand(
      body.triggerPhrase,
      body.actionEndpoint,
      body.packId,
    );
  }

  @Post('commands/execute')
  @ApiOperation({ summary: 'Execute Command palette trigger commands' })
  async executeCommand(
    @Body() body: { tenantId?: string; userId: string; trigger: string },
  ) {
    return this.command.executeCommand(
      body.tenantId || 'GLOBAL',
      body.userId,
      body.trigger,
    );
  }

  @Post('dashboards')
  @ApiOperation({ summary: 'Save personalized dashboard layout grids' })
  async saveDashboard(
    @Body()
    body: {
      tenantId?: string;
      userId: string;
      name: string;
      layout: any;
      isDefault?: boolean;
    },
  ) {
    return this.dashboard.saveDashboardLayout(
      body.tenantId || 'GLOBAL',
      body.userId,
      body.name,
      body.layout,
      body.isDefault,
    );
  }

  @Get('dashboards/:id')
  @ApiOperation({ summary: 'Fetch dashboard config properties' })
  async getDashboard(@Param('id') id: string) {
    return this.dashboard.getDashboardLayout(id);
  }

  @Post('widgets')
  @ApiOperation({ summary: 'Register operational widget cards' })
  async registerWidget(
    @Body()
    body: {
      tenantId?: string;
      code: string;
      title: string;
      type: string;
      configSchema: any;
      packId?: string;
    },
  ) {
    return this.dashboard.registerWidget(
      body.tenantId || 'GLOBAL',
      body.code,
      body.title,
      body.type,
      body.configSchema,
      body.packId,
    );
  }
}
