import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class Customer360Service {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomer360Profile(customerId: string) {
    const customer = await this.prisma.customers.findUnique({
      where: { id: customerId },
      include: { profile: true, contacts: true },
    });
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    const orders = await this.prisma.universal_orders.findMany({
      where: { customerId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const payments = await this.prisma.payment_transactions.findMany({
      where: { customerId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const loyalty = await this.prisma.crm_loyalty.findUnique({
      where: { customerId },
      include: { ledger: true },
    });

    const tickets = await this.prisma.crm_tickets.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });

    const cases = await this.prisma.crm_cases.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });

    const interactions = await this.prisma.crm_interactions.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });

    const consents = await this.prisma.crm_consents.findMany({
      where: { customerId },
    });

    const name = customer.profile
      ? `${customer.profile.firstName || ''} ${customer.profile.lastName || ''}`.trim() ||
        customer.profile.displayName ||
        'Unknown'
      : 'Unknown';
    const email =
      customer.contacts.find((c: any) => c.type === 'PRIMARY_EMAIL')?.value ||
      null;
    const phone =
      customer.contacts.find((c: any) => c.type === 'PRIMARY_PHONE')?.value ||
      null;

    return {
      customerId,
      customerDetails: {
        name,
        email,
        phone,
        status: customer.status,
      },
      ordersCount: orders.length,
      recentOrders: orders,
      recentPayments: payments,
      loyaltySummary: loyalty
        ? { tier: loyalty.tier, balance: loyalty.pointsTotal }
        : null,
      tickets,
      cases,
      interactions,
      consents,
    };
  }
}
