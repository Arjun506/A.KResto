import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { IndustryPacksService } from './industry-packs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../tenant/tenant.guard';
import { apiSuccess } from '../common/responses/api-response';

@Controller('industry-packs')
@UseGuards(JwtAuthGuard, TenantGuard)
export class IndustryPacksController {
  constructor(private readonly service: IndustryPacksService) {}

  @Get('installed')
  async installed(@Query('tenantId') tenantId: string) {
    const res = await this.service.listInstalledPacks(tenantId);
    return apiSuccess(res);
  }

  @Post(':industryKey/install')
  async install(
    @Query('tenantId') tenantId: string,
    @Param('industryKey') industryKey: string,
  ) {
    const res = await this.service.installPack(
      tenantId,
      industryKey.toUpperCase(),
    );
    return apiSuccess(
      res,
      `Industry Pack ${industryKey} installed successfully`,
    );
  }

  @Post(':industryKey/uninstall')
  async uninstall(
    @Query('tenantId') tenantId: string,
    @Param('industryKey') industryKey: string,
  ) {
    const res = await this.service.uninstallPack(
      tenantId,
      industryKey.toUpperCase(),
    );
    return apiSuccess(
      res,
      `Industry Pack ${industryKey} uninstalled successfully`,
    );
  }

  @Post(':industryKey/enable')
  async enable(
    @Query('tenantId') tenantId: string,
    @Param('industryKey') industryKey: string,
  ) {
    const res = await this.service.enablePack(
      tenantId,
      industryKey.toUpperCase(),
    );
    return apiSuccess(res, `Industry Pack ${industryKey} enabled successfully`);
  }

  @Post(':industryKey/disable')
  async disable(
    @Query('tenantId') tenantId: string,
    @Param('industryKey') industryKey: string,
  ) {
    const res = await this.service.disablePack(
      tenantId,
      industryKey.toUpperCase(),
    );
    return apiSuccess(
      res,
      `Industry Pack ${industryKey} disabled successfully`,
    );
  }

  @Post(':industryKey/update')
  async update(
    @Query('tenantId') tenantId: string,
    @Param('industryKey') industryKey: string,
    @Body() body: { version: string },
  ) {
    const res = await this.service.updatePack(
      tenantId,
      industryKey.toUpperCase(),
      body.version,
    );
    return apiSuccess(
      res,
      `Industry Pack ${industryKey} updated to version ${body.version}`,
    );
  }

  @Get('sidebar')
  sidebar(@Query('tenantId') tenantId: string, @Query('role') role: string) {
    return this.service.getDerivedSidebar({ tenantId, role });
  }

  @Get('widgets')
  widgets(@Query('tenantId') tenantId: string, @Query('role') role: string) {
    return this.service.getDerivedWidgets({ tenantId, role });
  }
}
