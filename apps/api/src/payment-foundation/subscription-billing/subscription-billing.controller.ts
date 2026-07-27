import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionBillingService } from './subscription-billing.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Subscription Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing-schedules')
export class SubscriptionBillingController {
  constructor(private readonly service: SubscriptionBillingService) {}

  @Post()
  @ApiOperation({ summary: 'Create recurring billing schedule for a customer' })
  async createBillingSchedule(
    @Body()
    body: {
      tenantId?: string;
      customerId: string;
      amount: number;
      frequency?: string;
    },
  ) {
    return this.service.createBillingSchedule(
      body.tenantId || 'GLOBAL',
      body.customerId,
      body.amount,
      body.frequency,
    );
  }

  @Post(':id/trigger')
  @ApiOperation({
    summary: 'Trigger automatic billing cycle charge and reschedule next cycle',
  })
  async triggerBillingSchedule(@Param('id') id: string) {
    return this.service.triggerBillingSchedule(id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'List billing schedules for a customer' })
  async getCustomerSchedules(@Param('customerId') customerId: string) {
    return this.service.getCustomerSchedules(customerId);
  }
}
