import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MasterDataService } from './master-data.service';
import { TenantId } from '../tenant/tenant.decorator';
import { RequirePermission } from '../auth/require-permission.decorator';
import {
  CreateMasterDataDto,
  UpdateMasterDataDto,
} from './dto/master-data.dto';

@Controller('master-data')
export class MasterDataController {
  constructor(private readonly service: MasterDataService) {}

  @Get(':resource')
  @RequirePermission('master-data:read')
  list(
    @TenantId() tenantId: string,
    @Param('resource') resource: string,
    @Query('q') q?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '50',
    @Query('isActive') isActive?: string,
  ) {
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedPageSize = Math.max(1, Math.min(200, Number(pageSize) || 50));
    return this.service.list({
      tenantId,
      resource,
      q,
      page: parsedPage,
      pageSize: parsedPageSize,
      isActive: isActive === undefined ? undefined : isActive === 'true',
    });
  }

  @Get(':resource/:id')
  @RequirePermission('master-data:read')
  getById(
    @TenantId() tenantId: string,
    @Param('resource') resource: string,
    @Param('id') id: string,
  ) {
    return this.service.getById({ tenantId, resource, id });
  }

  @Post(':resource')
  @RequirePermission('master-data:create')
  create(
    @TenantId() tenantId: string,
    @Param('resource') resource: string,
    @Body() dto: CreateMasterDataDto,
  ) {
    return this.service.create({ tenantId, resource, dto });
  }

  @Patch(':resource/:id')
  @RequirePermission('master-data:update')
  update(
    @TenantId() tenantId: string,
    @Param('resource') resource: string,
    @Param('id') id: string,
    @Body() dto: UpdateMasterDataDto,
  ) {
    return this.service.update({ tenantId, resource, id, dto });
  }

  @Delete(':resource/:id')
  @RequirePermission('master-data:delete')
  delete(
    @TenantId() tenantId: string,
    @Param('resource') resource: string,
    @Param('id') id: string,
  ) {
    return this.service.softDelete({ tenantId, resource, id });
  }
}
