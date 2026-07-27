import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PackRegistryService } from './pack-registry.service';
import { PackLifecycleService } from './pack-lifecycle.service';
import { PackHealthService } from './pack-health.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Platform Pack Engine — Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('platform-packs')
export class PlatformPackEngineController {
  constructor(
    private readonly registry: PackRegistryService,
    private readonly lifecycle: PackLifecycleService,
    private readonly health: PackHealthService,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload bundle archive file' })
  async uploadPack(
    @Body() body: { code: string; name: string; licenseKey?: string },
  ) {
    return this.registry.uploadPack(body.code, body.name, body.licenseKey);
  }

  @Post(':id/install')
  @ApiOperation({
    summary: 'Install version details mapping metadata configurations',
  })
  async installVersion(
    @Param('id') id: string,
    @Body() body: { version: string; changelog?: any },
  ) {
    return this.registry.installPackVersion(id, body.version, body.changelog);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate package within tenant scope bounds' })
  async activatePack(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.lifecycle.activatePack(id, tenantId || 'GLOBAL');
  }

  @Post(':id/disable')
  @ApiOperation({ summary: 'Disable active package' })
  async disablePack(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.lifecycle.disablePack(id, tenantId || 'GLOBAL');
  }

  @Post(':id/rollback')
  @ApiOperation({
    summary: 'Rollback pack updates to preceding certified snapshot',
  })
  async rollbackPack(
    @Param('id') id: string,
    @Body() body: { fromVersion: string; targetVersion: string },
  ) {
    return this.lifecycle.rollbackPack(
      id,
      body.fromVersion,
      body.targetVersion,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Uninstall and purge registrations data' })
  async uninstallPack(@Param('id') id: string) {
    return this.lifecycle.uninstallPack(id);
  }

  @Get()
  @ApiOperation({ summary: 'List platform packs' })
  async listPacks() {
    return this.registry.listPacks();
  }

  @Get(':id/health')
  @ApiOperation({ summary: 'Get telemetry metrics and health score' })
  async getHealth(@Param('id') id: string) {
    return this.health.getLatestHealth(id);
  }
}
