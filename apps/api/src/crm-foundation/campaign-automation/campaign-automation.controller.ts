import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignAutomationService } from './campaign-automation.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('CRM Foundation — Campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm-campaigns')
export class CampaignAutomationController {
  constructor(private readonly service: CampaignAutomationService) {}

  @Post()
  @ApiOperation({ summary: 'Create campaign structure' })
  async createCampaign(@Body() body: { tenantId?: string; name: string }) {
    return this.service.createCampaign(body.tenantId || 'GLOBAL', body.name);
  }

  @Post('launch')
  @ApiOperation({ summary: 'Launch automation campaign' })
  async launchCampaign(
    @Body() body: { campaignId: string; tenantId?: string },
  ) {
    return this.service.launchCampaign(body.campaignId, body.tenantId);
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete marketing automation campaign' })
  async completeCampaign(
    @Body() body: { campaignId: string; tenantId?: string },
  ) {
    return this.service.completeCampaign(body.campaignId, body.tenantId);
  }
}
