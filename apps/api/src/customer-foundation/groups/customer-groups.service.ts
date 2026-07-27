import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateCustomerGroupDto,
  AssignCustomerGroupDto,
} from './create-group.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CustomerGroupAssignedEvent } from '../../event-bus/events/customer.events';

@Injectable()
export class CustomerGroupsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createGroup(tenantId: string | undefined, dto: CreateCustomerGroupDto) {
    return this.prisma.customer_groups.create({
      data: {
        tenantId,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        color: dto.color,
      },
    });
  }

  async listGroups(tenantId?: string) {
    return this.prisma.customer_groups.findMany({
      where: tenantId ? { tenantId, deletedAt: null } : { deletedAt: null },
    });
  }

  async assignGroup(customerId: string, dto: AssignCustomerGroupDto) {
    const mapping = await this.prisma.customer_group_mappings.upsert({
      where: {
        customerId_groupId: {
          customerId,
          groupId: dto.groupId,
        },
      },
      create: { customerId, groupId: dto.groupId },
      update: {},
    });

    await this.eventBus.publish(
      new CustomerGroupAssignedEvent(customerId, {
        customerId,
        groupId: dto.groupId,
      }),
    );

    return mapping;
  }

  async unassignGroup(customerId: string, groupId: string) {
    return this.prisma.customer_group_mappings.deleteMany({
      where: { customerId, groupId },
    });
  }
}
