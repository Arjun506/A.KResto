import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './create-contact.dto';

@Injectable()
export class BusinessContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async addContact(businessId: string, dto: CreateContactDto) {
    if (dto.isPrimary) {
      await this.prisma.business_contacts.updateMany({
        where: { businessId, type: dto.type },
        data: { isPrimary: false },
      });
    }

    return this.prisma.business_contacts.create({
      data: {
        businessId,
        type: dto.type,
        name: dto.name,
        title: dto.title,
        email: dto.email,
        phone: dto.phone,
        isPrimary: dto.isPrimary ?? false,
        metadata: dto.metadata,
      },
    });
  }

  async getContacts(businessId: string) {
    return this.prisma.business_contacts.findMany({
      where: { businessId, deletedAt: null },
      orderBy: { isPrimary: 'desc' },
    });
  }

  async softDeleteContact(contactId: string) {
    return this.prisma.business_contacts.update({
      where: { id: contactId },
      data: { deletedAt: new Date() },
    });
  }
}
