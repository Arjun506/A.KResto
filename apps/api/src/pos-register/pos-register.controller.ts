import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PosRegisterService } from './pos-register.service';
import { OpenSessionDto } from './dto/open-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';
import { CashLogDto } from './dto/cash-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermission } from '../auth/require-permission.decorator';
import type { JwtUser } from '../common/types/jwt-user.interface';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { apiSuccess } from '../common/responses/api-response';
import { TenantGuard } from '../tenant/tenant.guard';

@Controller('pos-register')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class PosRegisterController {
  constructor(private readonly service: PosRegisterService) {}

  @Get('session/active')
  @RequirePermission(['pos:read', 'payments:read'])
  async getActiveSession(@Req() req: AuthenticatedRequest) {
    const user = req.user as JwtUser;
    const tenantId = req.tenantId as string;
    const data = await this.service.getActiveSession(tenantId, user.id);
    return apiSuccess(data, 'Active session retrieved successfully');
  }

  @Post('session/open')
  @RequirePermission('pos:write')
  async openSession(
    @Req() req: AuthenticatedRequest,
    @Body() dto: OpenSessionDto,
  ) {
    const user = req.user as JwtUser;
    const tenantId = req.tenantId as string;
    const data = await this.service.openSession(tenantId, user.id, dto);
    return apiSuccess(data, 'Cash register opened successfully');
  }

  @Post('session/close')
  @RequirePermission('pos:write')
  async closeSession(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CloseSessionDto,
  ) {
    const user = req.user as JwtUser;
    const tenantId = req.tenantId as string;
    const data = await this.service.closeSession(tenantId, user.id, dto);
    return apiSuccess(data, 'Cash register closed successfully');
  }

  @Post('session/cash-log')
  @RequirePermission('pos:write')
  async addCashLog(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CashLogDto,
  ) {
    const user = req.user as JwtUser;
    const tenantId = req.tenantId as string;
    const data = await this.service.addCashLog(tenantId, user.id, dto);
    return apiSuccess(data, 'Cash log recorded successfully');
  }

  @Get('sessions')
  @RequirePermission(['pos:read', 'payments:read'])
  async getSessionHistory(@Req() req: AuthenticatedRequest) {
    const tenantId = req.tenantId as string;
    const data = await this.service.getSessionHistory(tenantId);
    return apiSuccess(data, 'Session history retrieved successfully');
  }
}
