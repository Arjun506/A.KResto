import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  CampaignCreatedEvent,
  CampaignLaunchedEvent,
  CampaignCompletedEvent,
} from '../../event-bus/events/crm.events';

@Injectable()
export class CampaignAutomationService {
  constructor(private readonly eventBus: EventBusService) {}

  async createCampaign(tenantId: string, name: string) {
    const campaignId = `CAMP-${Date.now()}`;
    await this.eventBus.publish(
      new CampaignCreatedEvent(campaignId, { campaignId, name }, tenantId),
    );
    return { campaignId, name, status: 'DRAFT' };
  }

  async launchCampaign(campaignId: string, tenantId?: string) {
    await this.eventBus.publish(
      new CampaignLaunchedEvent(campaignId, { campaignId }, tenantId),
    );
    return { campaignId, status: 'LAUNCHED' };
  }

  async completeCampaign(campaignId: string, tenantId?: string) {
    await this.eventBus.publish(
      new CampaignCompletedEvent(campaignId, { campaignId }, tenantId),
    );
    return { campaignId, status: 'COMPLETED' };
  }
}
