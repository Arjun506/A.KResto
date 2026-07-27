import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerRelationshipDto } from './create-relationship.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CustomerRelationshipCreatedEvent } from '../../event-bus/events/customer.events';

@Injectable()
export class CustomerRelationshipsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createRelationship(
    sourceCustomerId: string,
    dto: CreateCustomerRelationshipDto,
  ) {
    const rel = await this.prisma.customer_relationships.create({
      data: {
        sourceCustomerId,
        targetCustomerId: dto.targetCustomerId,
        targetBusinessId: dto.targetBusinessId,
        targetOrganizationId: dto.targetOrganizationId,
        type: dto.type,
        notes: dto.notes,
      },
    });

    await this.eventBus.publish(
      new CustomerRelationshipCreatedEvent(sourceCustomerId, {
        sourceCustomerId,
        targetCustomerId: dto.targetCustomerId,
        type: dto.type,
      }),
    );

    return rel;
  }

  async getRelationships(customerId: string) {
    return this.prisma.customer_relationships.findMany({
      where: {
        OR: [
          { sourceCustomerId: customerId },
          { targetCustomerId: customerId },
        ],
        deletedAt: null,
      },
      include: {
        sourceCustomer: {
          select: { id: true, customerCode: true, profile: true },
        },
        targetCustomer: {
          select: { id: true, customerCode: true, profile: true },
        },
      },
    });
  }

  async removeRelationship(id: string) {
    return this.prisma.customer_relationships.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
