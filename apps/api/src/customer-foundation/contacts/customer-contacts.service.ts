import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerContactDto } from './create-contact.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CustomerContactAddedEvent } from '../../event-bus/events/customer.events';

@Injectable()
export class CustomerContactsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async addContact(customerId: string, dto: CreateCustomerContactDto) {
    if (dto.isPrimary) {
      await this.prisma.customer_contacts.updateMany({
        where: { customerId, type: dto.type },
        data: { isPrimary: false },
      });
    }

    const contact = await this.prisma.customer_contacts.create({
      data: {
        customerId,
        type: dto.type,
        value: dto.value,
        isPrimary: dto.isPrimary ?? false,
      },
    });

    await this.eventBus.publish(
      new CustomerContactAddedEvent(customerId, {
        customerId,
        contactId: contact.id,
        type: dto.type,
      }),
    );

    return contact;
  }

  async getContacts(customerId: string) {
    return this.prisma.customer_contacts.findMany({
      where: { customerId, deletedAt: null },
      orderBy: { isPrimary: 'desc' },
    });
  }

  async softDeleteContact(contactId: string) {
    return this.prisma.customer_contacts.update({
      where: { id: contactId },
      data: { deletedAt: new Date() },
    });
  }
}
