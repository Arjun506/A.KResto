import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { TenantGuard } from '../tenant/tenant.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('kpis')
  @Roles(
    'OWNER',
    'RESTAURANT_OWNER',
    'MANAGER',
    'CASHIER',
    'WAITER',
    'CHEF',
    'SUPER_ADMIN',
  )
  async getKpis(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.analyticsService.getKpis(req.user));
  }

  @Get('revenue')
  @Roles(
    'OWNER',
    'RESTAURANT_OWNER',
    'MANAGER',
    'CASHIER',
    'WAITER',
    'CHEF',
    'SUPER_ADMIN',
  )
  async getRevenue(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.analyticsService.getRevenue(req.user));
  }

  @Get('orders')
  @Roles(
    'OWNER',
    'RESTAURANT_OWNER',
    'MANAGER',
    'CASHIER',
    'WAITER',
    'CHEF',
    'SUPER_ADMIN',
  )
  async getOrders(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.analyticsService.getOrders(req.user));
  }

  @Get('menu')
  @Roles(
    'OWNER',
    'RESTAURANT_OWNER',
    'MANAGER',
    'CASHIER',
    'WAITER',
    'CHEF',
    'SUPER_ADMIN',
  )
  async getMenu(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.analyticsService.getMenu(req.user));
  }
}
