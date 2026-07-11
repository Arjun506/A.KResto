import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { ModulePlatformService } from './module-platform.service';

@Controller('module-platform')
export class ModulePlatformController {
  constructor(private readonly modulePlatform: ModulePlatformService) {}

  @Get('registry')
  async getRegistry() {
    return this.modulePlatform.listAllRegistryModules();
  }

  @Get('installed')
  async listInstalled(@Query('tenantId') tenantId?: string) {
    if (!tenantId) {
      // Stabilization: avoid passing undefined into tenant-aware queries
      throw new Error('tenantId is required');
    }

    return this.modulePlatform.listInstalledModules({ tenantId });
  }

  @Post(':moduleId/install')
  async install(
    @Param('moduleId') moduleId: string,
    @Query('tenantId') tenantId: string,
    @Body()
    body?: {
      version?: string;
      config?: unknown;
    },
  ) {
    return this.modulePlatform.installModule({
      tenantId,
      moduleId,
      version: body?.version,
      config: body?.config,
    });
  }

  @Post(':moduleId/uninstall')
  async uninstall(
    @Param('moduleId') moduleId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.modulePlatform.uninstallModule({ tenantId, moduleId });
  }

  @Post(':moduleId/enable')
  async enable(
    @Param('moduleId') moduleId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.modulePlatform.setModuleEnabled({
      tenantId,
      moduleId,
      enabled: true,
    });
  }

  @Post(':moduleId/disable')
  async disable(
    @Param('moduleId') moduleId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.modulePlatform.setModuleEnabled({
      tenantId,
      moduleId,
      enabled: false,
    });
  }

  @Post(':moduleId/update')
  async update(
    @Param('moduleId') moduleId: string,
    @Query('tenantId') tenantId: string,
    @Body() body?: { version?: string; config?: unknown },
  ) {
    return this.modulePlatform.updateModule({
      tenantId,
      moduleId,
      version: body?.version,
      config: body?.config,
    });
  }

  // Dynamic UI outputs
  @Get('sidebar')
  async sidebar(
    @Query('tenantId') tenantId: string,
    @Query('role') role: string,
  ) {
    return this.modulePlatform.getSidebarItems({ tenantId, role });
  }

  @Get('widgets')
  async widgets(
    @Query('tenantId') tenantId: string,
    @Query('role') role: string,
  ) {
    return this.modulePlatform.getWidgetsForDashboard({ tenantId, role });
  }
}
