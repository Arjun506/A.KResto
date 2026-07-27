import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../tenant/tenant.guard';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';

@Controller('subscription')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('status')
  async getStatus(@Req() req: AuthenticatedRequest) {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing');
    }
    const data = await this.subscriptionService.getSubscriptionStatus(tenantId);
    return apiSuccess(data);
  }

  @Post('license/activate')
  async activateLicense(
    @Req() req: AuthenticatedRequest,
    @Body() body: { licenseKey: string },
  ) {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing');
    }
    const data = await this.subscriptionService.activateLicenseKey(
      tenantId,
      body.licenseKey,
    );
    return apiSuccess(data, 'License key activated successfully');
  }

  @Post('cancel')
  async cancelSubscription(@Req() req: AuthenticatedRequest) {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing');
    }
    const data = await this.subscriptionService.cancelSubscription(tenantId);
    return apiSuccess(data, 'Subscription cancelled successfully');
  }
}
