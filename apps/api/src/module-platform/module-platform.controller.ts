import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ModulePlatformService } from './module-platform.service';
import { apiSuccess } from '../common/responses/api-response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Universal Module & Industry Platform')
@Controller('module-platform')
export class ModulePlatformController {
  constructor(private readonly modulePlatform: ModulePlatformService) {}

  @Get('industries')
  @ApiOperation({ summary: 'List all supported universal industries & packs' })
  async getIndustries() {
    const data = await this.modulePlatform.getIndustries();
    return apiSuccess(data, 'Universal industries retrieved');
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get recommended module pack bundle for industry' })
  async getRecommendations(@Query('industry') industry: string) {
    const data = await this.modulePlatform.getRecommendations(industry || 'RESTAURANT');
    return apiSuccess(data);
  }

  @Get('registry')
  @ApiOperation({ summary: 'List all modules in registry' })
  async getRegistry() {
    const data = await this.modulePlatform.listAllRegistryModules();
    return apiSuccess(data);
  }

  @Get('installed')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async listInstalled(@Req() req: any, @Query('tenantId') tenantId?: string) {
    const activeTenantId = req.user?.tenantId || tenantId || 'global';
    const data = await this.modulePlatform.listInstalledModules({ tenantId: activeTenantId });
    return apiSuccess(data);
  }

  @Post(':moduleId/install')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async install(
    @Req() req: any,
    @Param('moduleId') moduleId: string,
    @Query('tenantId') tenantId?: string,
    @Body() body?: { version?: string; config?: unknown },
  ) {
    const activeTenantId = req.user?.tenantId || tenantId || 'global';
    const data = await this.modulePlatform.installModule({
      tenantId: activeTenantId,
      moduleId,
      version: body?.version,
      config: body?.config,
    });
    return apiSuccess(data, `Module ${moduleId} installed and activated`);
  }

  @Post(':moduleId/uninstall')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async uninstall(
    @Req() req: any,
    @Param('moduleId') moduleId: string,
    @Query('tenantId') tenantId?: string,
  ) {
    const activeTenantId = req.user?.tenantId || tenantId || 'global';
    const data = await this.modulePlatform.uninstallModule({ tenantId: activeTenantId, moduleId });
    return apiSuccess(data, `Module ${moduleId} uninstalled`);
  }

  @Post(':moduleId/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async enable(
    @Req() req: any,
    @Param('moduleId') moduleId: string,
    @Query('tenantId') tenantId?: string,
  ) {
    const activeTenantId = req.user?.tenantId || tenantId || 'global';
    const data = await this.modulePlatform.setModuleEnabled({
      tenantId: activeTenantId,
      moduleId,
      enabled: true,
    });
    return apiSuccess(data, `Module ${moduleId} enabled`);
  }

  @Post(':moduleId/disable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async disable(
    @Req() req: any,
    @Param('moduleId') moduleId: string,
    @Query('tenantId') tenantId?: string,
  ) {
    const activeTenantId = req.user?.tenantId || tenantId || 'global';
    const data = await this.modulePlatform.setModuleEnabled({
      tenantId: activeTenantId,
      moduleId,
      enabled: false,
    });
    return apiSuccess(data, `Module ${moduleId} disabled`);
  }

  @Post(':moduleId/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Req() req: any,
    @Param('moduleId') moduleId: string,
    @Query('tenantId') tenantId?: string,
    @Body() body?: { version?: string; config?: unknown },
  ) {
    const activeTenantId = req.user?.tenantId || tenantId || 'global';
    const data = await this.modulePlatform.updateModule({
      tenantId: activeTenantId,
      moduleId,
      version: body?.version,
      config: body?.config,
    });
    return apiSuccess(data, `Module ${moduleId} updated`);
  }

  @Get('features')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getFeatures(@Req() req: any) {
    const tenantId = req.user?.tenantId || 'global';
    const data = await this.modulePlatform.getTenantFeatures(tenantId);
    return apiSuccess(data);
  }

  @Patch('features/:featureKey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateFeature(
    @Req() req: any,
    @Param('featureKey') featureKey: string,
    @Body('isEnabled') isEnabled: boolean,
    @Body('config') config?: any,
  ) {
    const tenantId = req.user?.tenantId || 'global';
    const data = await this.modulePlatform.updateTenantFeature(tenantId, featureKey, isEnabled, config);
    return apiSuccess(data, `Feature ${featureKey} updated`);
  }

  @Get('discovery/capabilities')
  @ApiOperation({ summary: 'Universal AI Buddy & Customer App discovery contract' })
  async discoverCapabilities(
    @Query('tenantId') tenantId: string,
    @Query('branchId') branchId?: string,
  ) {
    const data = await this.modulePlatform.discoverBranchCapabilities(tenantId || 'rest-1', branchId);
    return apiSuccess(data);
  }

  @Get('sidebar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async sidebar(
    @Req() req: any,
    @Query('tenantId') tenantId?: string,
    @Query('role') role?: string,
  ) {
    const activeTenantId = req.user?.tenantId || tenantId || 'global';
    const activeRole = req.user?.role || role || 'STAFF';
    const data = await this.modulePlatform.getSidebarItems({ tenantId: activeTenantId, role: activeRole });
    return apiSuccess(data);
  }

  @Get('widgets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async widgets(
    @Req() req: any,
    @Query('tenantId') tenantId?: string,
    @Query('role') role?: string,
  ) {
    const activeTenantId = req.user?.tenantId || tenantId || 'global';
    const activeRole = req.user?.role || role || 'STAFF';
    const data = await this.modulePlatform.getWidgetsForDashboard({ tenantId: activeTenantId, role: activeRole });
    return apiSuccess(data);
  }
}
