import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateConsentDto } from './update-consent.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CustomerConsentUpdatedEvent } from '../../event-bus/events/customer.events';

@Injectable()
export class CustomerConsentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async updateConsent(
    customerId: string,
    dto: UpdateConsentDto,
    actorId?: string,
  ) {
    const consent = await this.prisma.customer_consents.create({
      data: {
        customerId,
        type: dto.type,
        isGranted: dto.isGranted,
        version: dto.version || '1.0',
        source: dto.source || 'WEB',
        actorId,
        grantedAt: dto.isGranted ? new Date() : undefined,
        revokedAt: dto.isGranted ? undefined : new Date(),
      },
    });

    await this.eventBus.publish(
      new CustomerConsentUpdatedEvent(customerId, {
        customerId,
        consentType: dto.type,
        isGranted: dto.isGranted,
      }),
    );

    return consent;
  }

  async getConsentHistory(customerId: string) {
    return this.prisma.customer_consents.findMany({
      where: { customerId },
      orderBy: { grantedAt: 'desc' },
    });
  }
}
