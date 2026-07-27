import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateBusinessProfileDto } from './update-profile.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { BusinessUpdatedEvent } from '../../event-bus/events/business.events';

@Injectable()
export class BusinessProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async updateProfile(businessId: string, dto: UpdateBusinessProfileDto) {
    const business = await this.prisma.businesses.findFirst({
      where: { id: businessId, deletedAt: null },
    });
    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    const updated = await this.prisma.businesses.update({
      where: { id: businessId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.legalName && { legalName: dto.legalName }),
        ...(dto.displayName && { displayName: dto.displayName }),
        ...(dto.description && { description: dto.description }),
        ...(dto.branding && { branding: dto.branding }),
        ...(dto.socialLinks && { socialLinks: dto.socialLinks }),
      },
    });

    await this.eventBus.publish(
      new BusinessUpdatedEvent(
        businessId,
        { businessId, changes: dto },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }
}
