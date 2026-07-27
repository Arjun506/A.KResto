import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebhookEngineService } from './webhook-engine.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Workflow Foundation — Webhooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflow-webhooks')
export class WebhookEngineController {
  constructor(private readonly service: WebhookEngineService) {}

  @Post()
  @ApiOperation({
    summary: 'Subscribe to outward event notifications with signing keys',
  })
  async createWebhook(
    @Body()
    body: {
      tenantId?: string;
      name: string;
      url: string;
      eventPattern: string;
    },
  ) {
    return this.service.createWebhook(
      body.tenantId || 'GLOBAL',
      body.name,
      body.url,
      body.eventPattern,
    );
  }

  @Post('test-dispatch')
  @ApiOperation({ summary: 'Trigger mock webhook payload delivery check' })
  async dispatch(@Body() body: { webhookId: string; payload: any }) {
    return this.service.dispatchWebhook(body.webhookId, body.payload);
  }

  @Get()
  @ApiOperation({ summary: 'List webhook subscriptions' })
  async getWebhooks(@Query('tenantId') tenantId?: string) {
    return this.service.getWebhooks(tenantId);
  }
}
