import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCustomerProfileDto } from './update-profile.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CustomerProfileUpdatedEvent } from '../../event-bus/events/customer.events';

@Injectable()
export class CustomerProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async updateProfile(customerId: string, dto: UpdateCustomerProfileDto) {
    const customer = await this.prisma.customers.findFirst({
      where: { id: customerId, deletedAt: null },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const updated = await this.prisma.customer_profiles.upsert({
      where: { customerId },
      create: { customerId, ...dto },
      update: { ...dto },
    });

    await this.eventBus.publish(
      new CustomerProfileUpdatedEvent(
        customerId,
        { customerId, changes: dto },
        customer.tenantId || undefined,
      ),
    );

    return updated;
  }
}
