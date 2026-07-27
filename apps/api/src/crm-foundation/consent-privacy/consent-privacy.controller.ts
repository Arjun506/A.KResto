import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConsentPrivacyService } from './consent-privacy.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('CRM Foundation — Consent & Privacy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm-consents')
export class ConsentPrivacyController {
  constructor(private readonly service: ConsentPrivacyService) {}

  @Post()
  @ApiOperation({
    summary:
      'Update customer opt-in/opt-out preferences (marketing, communication, processing) with audit log',
  })
  async updateConsent(
    @Body()
    body: {
      customerId: string;
      consentType: string;
      isGranted: boolean;
      ipAddress?: string;
    },
  ) {
    return this.service.updateConsent(
      body.customerId,
      body.consentType,
      body.isGranted,
      body.ipAddress,
    );
  }

  @Get('customer/:customerId')
  @ApiOperation({
    summary: 'Retrieve opt-in and consent history records for a customer',
  })
  async getConsents(@Param('customerId') customerId: string) {
    return this.service.getCustomerConsents(customerId);
  }
}
