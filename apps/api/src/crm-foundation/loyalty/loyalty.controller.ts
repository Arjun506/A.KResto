import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('CRM Foundation — Loyalty & Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm-loyalty')
export class LoyaltyController {
  constructor(private readonly service: LoyaltyService) {}

  @Post('customer/:customerId')
  @ApiOperation({
    summary: 'Retrieve or initialize customer membership profile',
  })
  async getOrCreateLoyalty(
    @Param('customerId') customerId: string,
    @Body() body: { tenantId?: string },
  ) {
    return this.service.getOrCreateLoyalty(
      body.tenantId || 'GLOBAL',
      customerId,
    );
  }

  @Post(':id/award')
  @ApiOperation({ summary: 'Credit loyalty points balance' })
  async awardPoints(
    @Param('id') id: string,
    @Body() body: { points: number; reasonCode: string },
  ) {
    return this.service.awardPoints(id, body.points, body.reasonCode);
  }

  @Post(':id/redeem')
  @ApiOperation({ summary: 'Redeem loyalty points balance' })
  async redeemPoints(
    @Param('id') id: string,
    @Body() body: { points: number; reasonCode: string },
  ) {
    return this.service.redeemPoints(id, body.points, body.reasonCode);
  }
}
