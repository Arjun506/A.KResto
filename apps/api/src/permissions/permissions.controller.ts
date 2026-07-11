import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../tenant/tenant.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermission } from '../auth/require-permission.decorator';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';

@Controller('permissions')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('roles')
  @RequirePermission('roles:read')
  async listRoles(@Req() req: AuthenticatedRequest) {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing');
    }
    const data = await this.permissionsService.listRoles(tenantId);
    return apiSuccess(data);
  }

  @Post('roles')
  @RequirePermission('roles:write')
  async upsertRole(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateRoleDto,
  ) {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing');
    }
    const data = await this.permissionsService.upsertRole(tenantId, dto);
    return apiSuccess(data, 'Role configuration updated');
  }

  @Post('assign')
  @RequirePermission('roles:write')
  async assignRole(
    @Req() req: AuthenticatedRequest,
    @Body() dto: AssignRoleDto,
  ) {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing');
    }
    const data = await this.permissionsService.assignRole(tenantId, dto);
    return apiSuccess(data, 'User role assigned successfully');
  }
}
