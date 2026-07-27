import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SaasCommerceService } from './saas-commerce.service';
import { OnboardTenantDto } from './dto/onboard.dto';
import { UpdateEntitlementDto } from './dto/update-entitlement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionStatus, PlanTier } from '@prisma/client';

@ApiTags('SaaS Commercialization Platform — Operations')
@Controller('saas')
export class SaasCommerceController {
  constructor(private readonly service: SaasCommerceService) {}

  @Post('onboard')
  @ApiOperation({
    summary:
      'Onboard a new business, creating tenant workspace, sub, and admin user',
  })
  async onboard(@Body() body: OnboardTenantDto) {
    return this.service.onboardTenant(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('entitlements')
  @ApiOperation({ summary: 'Resolve feature entitlements' })
  async resolveEntitlement(
    @Req() req: any,
    @Query('featureKey') featureKey: string,
  ) {
    const tenantId = req.user.tenantId || 'GLOBAL';
    return this.service.resolveEntitlement(tenantId, featureKey);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('entitlements/override')
  @ApiOperation({
    summary: 'Configure tenant feature entitlements overrides (Admin only)',
  })
  async setOverride(@Req() req: any, @Body() body: UpdateEntitlementDto) {
    const tenantId = req.user.tenantId || 'GLOBAL';
    return this.service.setEntitlementOverride(tenantId, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('subscriptions/:id/status')
  @ApiOperation({ summary: 'Transition subscription billing statuses' })
  async transitionStatus(
    @Param('id') id: string,
    @Body() body: { status: SubscriptionStatus },
  ) {
    return this.service.transitionSubscription(id, body.status);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('subscriptions/upgrade')
  @ApiOperation({ summary: 'Upgrade active tenant subscription plan tier' })
  async upgradePlan(@Req() req: any, @Body() body: { planTier: PlanTier }) {
    const tenantId = req.user.tenantId || 'GLOBAL';
    return this.service.upgradePlan(tenantId, body.planTier);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('seats/check')
  @ApiOperation({
    summary: 'Check active workforce employees against plan seat limits',
  })
  async checkSeats(@Req() req: any) {
    const tenantId = req.user.tenantId || 'GLOBAL';
    return this.service.checkSeatLimit(tenantId);
  }

  @Post('webhooks/billing')
  @ApiOperation({ summary: 'Receive payment gateway billing update events' })
  async billingWebhook(@Body() body: { eventId: string; payload: any }) {
    return this.service.processBillingWebhook(body.eventId, body.payload);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('usage/record')
  @ApiOperation({ summary: 'Record usage unit consumption' })
  async recordUsage(
    @Req() req: any,
    @Body() body: { featureKey: string; units: number },
  ) {
    const tenantId = req.user.tenantId || 'GLOBAL';
    return this.service.recordUsage(tenantId, body.featureKey, body.units);
  }
}
