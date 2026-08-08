import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../../tenant/tenant.guard';
import { apiSuccess } from '../../common/responses/api-response';

@ApiTags('CRM Foundation — Referrals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('crm-referrals')
export class ReferralsController {
  constructor(private readonly service: ReferralsService) {}

  @Get('customer/:customerId/code')
  @ApiOperation({ summary: 'Get or generate referral code for customer' })
  async getReferralCode(@Param('customerId') customerId: string, @Req() req: any) {
    const tenantId = req.user?.tenantId || 'GLOBAL';
    const data = await this.service.getOrCreateReferralCode(tenantId, customerId);
    return apiSuccess(data);
  }

  @Post('claim')
  @ApiOperation({ summary: 'Claim referral code for new customer' })
  async claimReferral(
    @Body() body: { referralCode: string; referredCustomerId: string },
    @Req() req: any,
  ) {
    const tenantId = req.user?.tenantId || 'GLOBAL';
    const data = await this.service.claimReferral(tenantId, body.referralCode, body.referredCustomerId);
    return apiSuccess(data);
  }
}
