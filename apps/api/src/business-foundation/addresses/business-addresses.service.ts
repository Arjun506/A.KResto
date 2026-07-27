import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './create-address.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { BusinessAddressAddedEvent } from '../../event-bus/events/business.events';

@Injectable()
export class BusinessAddressesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async addAddress(businessId: string, dto: CreateAddressDto) {
    if (dto.isPrimary) {
      await this.prisma.business_addresses.updateMany({
        where: { businessId },
        data: { isPrimary: false },
      });
    }

    const address = await this.prisma.business_addresses.create({
      data: {
        businessId,
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
      new BusinessAddressAddedEvent(businessId, {
        businessId,
        addressId: address.id,
        type: dto.type,
      }),
    );

    return address;
  }

  async getAddresses(businessId: string) {
    return this.prisma.business_addresses.findMany({
      where: { businessId, deletedAt: null },
      orderBy: { isPrimary: 'desc' },
    });
  }

  async softDeleteAddress(addressId: string) {
    return this.prisma.business_addresses.update({
      where: { id: addressId },
      data: { deletedAt: new Date() },
    });
  }
}
