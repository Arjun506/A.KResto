import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../../tenant/tenant.guard';
import { apiSuccess } from '../../common/responses/api-response';

@ApiTags('CRM Foundation — Loyalty & Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('crm-loyalty')
export class LoyaltyController {
  constructor(private readonly service: LoyaltyService) {}

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Retrieve customer loyalty profile by customer ID' })
  async getLoyaltyByCustomer(@Param('customerId') customerId: string) {
    const data = await this.service.getLoyaltyByCustomerId(customerId);
    return apiSuccess(data);
  }

  @Post('customer/:customerId')
  @ApiOperation({ summary: 'Retrieve or initialize customer membership profile' })
  async getOrCreateLoyalty(
    @Param('customerId') customerId: string,
    @Body() body: { tenantId?: string },
    @Req() req: any,
  ) {
    const tenantId = req.user?.tenantId || body.tenantId || 'GLOBAL';
    const data = await this.service.getOrCreateLoyalty(tenantId, customerId);
    return apiSuccess(data);
  }

  @Post(':id/award')
  @ApiOperation({ summary: 'Credit loyalty points balance' })
  async awardPoints(
    @Param('id') id: string,
    @Body() body: { points: number; reasonCode: string },
    @Req() req: any,
  ) {
    const data = await this.service.awardPoints(id, Number(body.points), body.reasonCode, req.user?.id);
    return apiSuccess(data);
  }

  @Post(':id/redeem')
  @ApiOperation({ summary: 'Redeem loyalty points balance' })
  async redeemPoints(
    @Param('id') id: string,
    @Body() body: { points: number; reasonCode: string },
    @Req() req: any,
  ) {
    const data = await this.service.redeemPoints(id, Number(body.points), body.reasonCode, req.user?.id);
    return apiSuccess(data);
  }

  @Post(':id/adjust')
  @ApiOperation({ summary: 'Manually adjust loyalty points balance' })
  async adjustPoints(
    @Param('id') id: string,
    @Body() body: { points: number; reasonCode: string },
    @Req() req: any,
  ) {
    const data = await this.service.adjustPoints(id, Number(body.points), body.reasonCode, req.user?.id);
    return apiSuccess(data);
  }
}
