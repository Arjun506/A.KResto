import { Controller, Get, Post, Query } from '@nestjs/common';
import { IndustryPacksService } from './industry-packs.service';

@Controller('industry-packs')
export class IndustryPacksController {
  constructor(private readonly service: IndustryPacksService) {}

  @Get('installed')
  installed(@Query('tenantId') tenantId: string) {
    return this.service.listInstalledPacks(tenantId);
  }

  // Scaffolds: install/uninstall will be implemented in a later milestone.

  @Post(':industryKey/install')
  install() {
    return { ok: false, message: 'Not implemented yet (scaffold)' };
  }

  @Post(':industryKey/uninstall')
  uninstall() {
    return { ok: false, message: 'Not implemented yet (scaffold)' };
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
