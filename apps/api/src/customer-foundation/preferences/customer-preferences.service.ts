import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  UpdatePreferencesDto,
  UpdateCommunicationsDto,
} from './update-preferences.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  CustomerPreferencesUpdatedEvent,
  CustomerCommunicationSentEvent,
} from '../../event-bus/events/customer.events';

@Injectable()
export class CustomerPreferencesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async getPreferences(customerId: string) {
    let prefs = await this.prisma.customer_preferences.findUnique({
      where: { customerId },
    });
    if (!prefs) {
      prefs = await this.prisma.customer_preferences.create({
        data: { customerId, language: 'en', currency: 'USD', timezone: 'UTC' },
      });
    }
    return prefs;
  }

  async updatePreferences(customerId: string, dto: UpdatePreferencesDto) {
    const updated = await this.prisma.customer_preferences.upsert({
      where: { customerId },
      create: { customerId, ...dto },
      update: { ...dto },
    });

    await this.eventBus.publish(
      new CustomerPreferencesUpdatedEvent(customerId, {
        customerId,
        changes: dto,
      }),
    );

    return updated;
  }

  async getCommunications(customerId: string) {
    let comms = await this.prisma.customer_communications.findUnique({
      where: { customerId },
    });
    if (!comms) {
      comms = await this.prisma.customer_communications.create({
        data: { customerId, emailOptIn: true, smsOptIn: true, pushOptIn: true },
      });
    }
    return comms;
  }

  async updateCommunications(customerId: string, dto: UpdateCommunicationsDto) {
    return this.prisma.customer_communications.upsert({
      where: { customerId },
      create: { customerId, ...dto },
      update: { ...dto },
    });
  }

  async recordCommunicationHistory(
    customerId: string,
    channel: string,
    recipient: string,
    subject: string | undefined,
    content: string,
    actorId?: string,
  ) {
    const history = await this.prisma.customer_communication_history.create({
      data: {
        customerId,
        channel,
        recipient,
        subject,
        content,
        status: 'SENT',
        actorId,
      },
    });

    await this.eventBus.publish(
      new CustomerCommunicationSentEvent(customerId, {
        customerId,
        channel,
        recipient,
      }),
    );

    return history;
  }

  async getCommunicationHistory(customerId: string) {
    return this.prisma.customer_communication_history.findMany({
      where: { customerId },
      orderBy: { sentAt: 'desc' },
    });
  }
}
