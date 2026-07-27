import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { WebhookDeliveredEvent } from '../../event-bus/events/workflow.events';

@Injectable()
export class WebhookEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createWebhook(
    tenantId: string,
    name: string,
    url: string,
    eventPattern: string,
  ) {
    const key = `wh_sec_${Math.random().toString(36).substr(2, 16)}`;
    return this.prisma.workflow_webhooks.create({
      data: {
        tenantId,
        name,
        url,
        eventPattern,
        signingKey: key,
      },
    });
  }

  async dispatchWebhook(webhookId: string, payload: any, tenantId?: string) {
    const webhook = await this.prisma.workflow_webhooks.findUnique({
      where: { id: webhookId },
    });
    if (!webhook) {
      throw new Error(`Webhook ${webhookId} not found`);
    }

    // Run mock outbound HTTP request dispatch
    const responseCode = 200;

    await this.eventBus.publish(
      new WebhookDeliveredEvent(
        webhookId,
        { webhookId, targetUrl: webhook.url, responseCode },
        tenantId,
      ),
    );

    return {
      webhookId,
      url: webhook.url,
      responseCode,
      dispatchedAt: new Date(),
    };
  }

  async getWebhooks(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    return this.prisma.workflow_webhooks.findMany({ where });
  }
}
