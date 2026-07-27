import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustIdentityService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomerFederatedProfile(customerId: string) {
    const customer = await this.prisma.customers.findUnique({
      where: { id: customerId },
      include: {
        profile: true,
        contacts: true,
        custConsent: true,
        custWallet: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer profile ${customerId} not found`);
    }

    return {
      customerId,
      name: customer.profile?.firstName
        ? `${customer.profile.firstName} ${customer.profile.lastName || ''}`.trim()
        : 'Guest Customer',
      email:
        customer.contacts.find((c) => c.type === 'PRIMARY_EMAIL')?.value ||
        null,
      phone:
        customer.contacts.find((c) => c.type === 'MOBILE_PHONE')?.value || null,
      walletBalance: customer.custWallet?.balance || 0,
      privacySettings: {
        marketingConsent: customer.custConsent?.marketingConsent ?? true,
        gdprOptOut: customer.custConsent?.gdprOptOut ?? false,
      },
    };
  }
}
