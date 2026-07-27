import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerAddressDto } from './create-address.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CustomerAddressAddedEvent } from '../../event-bus/events/customer.events';

@Injectable()
export class CustomerAddressesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async addAddress(customerId: string, dto: CreateCustomerAddressDto) {
    if (dto.isPrimary) {
      await this.prisma.customer_addresses.updateMany({
        where: { customerId },
        data: { isPrimary: false },
      });
    }

    const address = await this.prisma.customer_addresses.create({
      data: {
        customerId,
        type: dto.type,
        line1: dto.line1,
        line2: dto.line2,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        country: dto.country,
        latitude: dto.latitude,
        longitude: dto.longitude,
        timezone: dto.timezone || 'UTC',
        isPrimary: dto.isPrimary ?? false,
      },
    });

    await this.eventBus.publish(
      new CustomerAddressAddedEvent(customerId, {
        customerId,
        addressId: address.id,
        type: dto.type,
      }),
    );

    return address;
  }

  async getAddresses(customerId: string) {
    return this.prisma.customer_addresses.findMany({
      where: { customerId, deletedAt: null },
      orderBy: { isPrimary: 'desc' },
    });
  }

  async softDeleteAddress(addressId: string) {
    return this.prisma.customer_addresses.update({
      where: { id: addressId },
      data: { deletedAt: new Date() },
    });
  }
}
