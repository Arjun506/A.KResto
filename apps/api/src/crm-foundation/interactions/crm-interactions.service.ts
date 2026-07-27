import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { InteractionRecordedEvent } from '../../event-bus/events/crm.events';

@Injectable()
export class CrmInteractionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async recordInteraction(
    tenantId: string,
    customerId: string,
    channel: string,
    subject?: string,
    notes?: string,
  ) {
    const interaction = await this.prisma.crm_interactions.create({
      data: {
        tenantId,
        customerId,
        channel,
        subject,
        notes,
      },
    });

    await this.eventBus.publish(
      new InteractionRecordedEvent(
        interaction.id,
        { interactionId: interaction.id, channel },
        tenantId,
      ),
    );

    return interaction;
  }

  async getCustomerInteractions(customerId: string) {
    return this.prisma.crm_interactions.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
