import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ConsentUpdatedEvent } from '../../event-bus/events/crm.events';

@Injectable()
export class ConsentPrivacyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async updateConsent(
    customerId: string,
    consentType: string,
    isGranted: boolean,
    ipAddress?: string,
  ) {
    const consent = await this.prisma.crm_consents.create({
      data: {
        customerId,
        consentType,
        isGranted,
        ipAddress,
      },
    });

    await this.eventBus.publish(
      new ConsentUpdatedEvent(consent.id, {
        customerId,
        consentType,
        isGranted,
      }),
    );

    return consent;
  }

  async getCustomerConsents(customerId: string) {
    return this.prisma.crm_consents.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
