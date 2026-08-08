import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RewardsService, CreateRewardDto } from './rewards.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../../tenant/tenant.guard';
import { apiSuccess } from '../../common/responses/api-response';

@ApiTags('CRM Foundation — Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('crm-rewards')
export class RewardsController {
  constructor(private readonly service: RewardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new tenant reward' })
  async createReward(@Body() dto: CreateRewardDto, @Req() req: any) {
    const tenantId = req.user?.tenantId || 'GLOBAL';
    const data = await this.service.createReward(tenantId, dto);
    return apiSuccess(data);
  }

  @Get()
  @ApiOperation({ summary: 'List active rewards for tenant' })
  async getRewards(@Req() req: any) {
    const tenantId = req.user?.tenantId || 'GLOBAL';
    const data = await this.service.getRewards(tenantId);
    return apiSuccess(data);
  }

  @Post('customer/:customerId/redeem/:rewardId')
  @ApiOperation({ summary: 'Redeem reward for customer' })
  async redeemReward(
    @Param('customerId') customerId: string,
    @Param('rewardId') rewardId: string,
    @Req() req: any,
  ) {
    const tenantId = req.user?.tenantId || 'GLOBAL';
    const data = await this.service.redeemReward(tenantId, customerId, rewardId, req.user?.id);
    return apiSuccess(data);
  }

  @Get('customer/:customerId/redemptions')
  @ApiOperation({ summary: 'Get customer reward redemptions history' })
  async getRedemptions(@Param('customerId') customerId: string, @Req() req: any) {
    const tenantId = req.user?.tenantId || 'GLOBAL';
    const data = await this.service.getRedemptions(tenantId, customerId);
    return apiSuccess(data);
  }
}
