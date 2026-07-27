import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CrmInteractionsService } from './crm-interactions.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('CRM Foundation — Interactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm-interactions')
export class CrmInteractionsController {
  constructor(private readonly service: CrmInteractionsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Record interaction log (Calls, Emails, SMS, WhatsApp, Meetings, Chat, Notes)',
  })
  async recordInteraction(
    @Body()
    body: {
      tenantId?: string;
      customerId: string;
      channel: string;
      subject?: string;
      notes?: string;
    },
  ) {
    return this.service.recordInteraction(
      body.tenantId || 'GLOBAL',
      body.customerId,
      body.channel,
      body.subject,
      body.notes,
    );
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get interaction history logs list for a customer' })
  async getCustomerInteractions(@Param('customerId') customerId: string) {
    return this.service.getCustomerInteractions(customerId);
  }
}
