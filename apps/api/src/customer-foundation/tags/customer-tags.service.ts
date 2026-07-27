import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerTagDto, AssignCustomerTagDto } from './create-tag.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CustomerTagAddedEvent } from '../../event-bus/events/customer.events';

@Injectable()
export class CustomerTagsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createTag(tenantId: string | undefined, dto: CreateCustomerTagDto) {
    return this.prisma.customer_tags.upsert({
      where: { name: dto.name },
      create: { tenantId, name: dto.name, color: dto.color },
      update: { color: dto.color },
    });
  }

  async listTags(tenantId?: string) {
    return this.prisma.customer_tags.findMany({
      where: tenantId ? { tenantId } : {},
    });
  }

  async assignTag(customerId: string, dto: AssignCustomerTagDto) {
    const mapping = await this.prisma.customer_tag_mappings.upsert({
      where: {
        customerId_tagId: { customerId, tagId: dto.tagId },
      },
      create: { customerId, tagId: dto.tagId },
      update: {},
    });

    await this.eventBus.publish(
      new CustomerTagAddedEvent(customerId, { customerId, tagId: dto.tagId }),
    );

    return mapping;
  }

  async unassignTag(customerId: string, tagId: string) {
    return this.prisma.customer_tag_mappings.deleteMany({
      where: { customerId, tagId },
    });
  }
}
