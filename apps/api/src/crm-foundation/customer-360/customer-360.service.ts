import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface Customer360Response {
  customerId: string;
  customerDetails: {
    name: string;
    email: string | null;
    phone: string | null;
    status: string;
    customerCode: string | null;
    identityType: string;
    lifecycleStage: string;
    source: string;
    language: string;
    createdAt: Date;
    addresses: any[];
    tags: string[];
    notes: any[];
  };
  metrics: {
    totalSpending: number;
    totalVisits: number;
    averageOrderValue: number;
    lifetimeValue: number;
    firstVisit: Date | null;
    lastVisit: Date | null;
    segment: string;
  };
  loyaltySummary: {
    tier: string;
    pointsTotal: number;
    status: string;
    ledger: any[];
  };
  rewards: {
    available: any[];
    redemptions: any[];
  };
  offers: any[];
  ordersCount: number;
  recentOrders: any[];
  recentPayments: any[];
  tickets: any[];
  timeline: any[];
}

@Injectable()
export class Customer360Service {
  constructor(private readonly prisma: PrismaService) {}

  calculateSegment(totalVisits: number, totalSpent: number, daysSinceLastVisit: number | null, tier: string): string {
    if (tier === 'PLATINUM' || tier === 'GOLD' || totalSpent >= 10000) {
      return 'VIP';
    }
    if (totalSpent >= 5000) {
      return 'HIGH_VALUE';
    }
    if (daysSinceLastVisit !== null && daysSinceLastVisit > 60 && totalVisits > 1) {
      return 'AT_RISK';
    }
    if (daysSinceLastVisit !== null && daysSinceLastVisit > 90) {
      return 'INACTIVE';
    }
    if (totalVisits > 5) {
      return 'FREQUENT_BUYER';
    }
    if (totalVisits >= 2) {
      return 'RETURNING';
    }
    if (daysSinceLastVisit !== null && daysSinceLastVisit <= 7) {
      return 'RECENTLY_ACTIVE';
    }
    return 'NEW';
  }

  async getCustomer360Profile(customerId: string): Promise<Customer360Response> {
    const customer = await this.prisma.customers.findUnique({
      where: { id: customerId },
      include: {
        profile: true,
        contacts: { where: { deletedAt: null } },
        addresses: { where: { deletedAt: null } },
        preferences: true,
        tagMappings: { include: { tag: true } },
        notes: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
        crmLoyalty: { include: { ledger: { orderBy: { createdAt: 'desc' }, take: 20 } } },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    const tenantId = customer.tenantId || undefined;

    // 1. Fetch Orders for metrics
    const orders = await this.prisma.universal_orders.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });

    // Also fetch standard orders if linked by customerPhone or customerName
    const phoneContact = customer.contacts.find((c) => c.type === 'MOBILE_PHONE' || c.type === 'WORK_PHONE' || c.isPrimary)?.value;
    let standardOrders: any[] = [];
    if (phoneContact) {
      standardOrders = await this.prisma.orders.findMany({
        where: { customerPhone: phoneContact },
        orderBy: { createdAt: 'desc' },
      });
    }

    const totalVisits = orders.length + standardOrders.length;
    let totalSpending = orders.reduce((sum, o) => sum + Number(o.grandTotal || 0), 0);
    totalSpending += standardOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    const averageOrderValue = totalVisits > 0 ? totalSpending / totalVisits : 0;
    const lifetimeValue = totalSpending;

    let firstVisit: Date | null = null;
    let lastVisit: Date | null = null;

    const allOrderDates = [
      ...orders.map((o) => o.createdAt),
      ...standardOrders.map((o) => o.createdAt),
    ].sort((a, b) => a.getTime() - b.getTime());

    if (allOrderDates.length > 0) {
      firstVisit = allOrderDates[0];
      lastVisit = allOrderDates[allOrderDates.length - 1];
    }

    const daysSinceLastVisit = lastVisit
      ? Math.floor((Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // 2. Loyalty Summary
    let crmLoyalty = customer.crmLoyalty;
    if (!crmLoyalty) {
      crmLoyalty = await this.prisma.crm_loyalty.create({
        data: {
          tenantId: customer.tenantId,
          customerId,
          tier: 'NEW',
          pointsTotal: 0,
        },
        include: { ledger: true },
      });
    }

    const currentTier = crmLoyalty.tier || 'NEW';
    const segment = this.calculateSegment(totalVisits, totalSpending, daysSinceLastVisit, currentTier);

    // 3. Rewards & Redemptions
    const availableRewards = tenantId
      ? await this.prisma.customer_rewards.findMany({
          where: { tenantId, isActive: true },
          orderBy: { pointsCost: 'asc' },
        })
      : [];

    const redemptions = await this.prisma.customer_reward_redemptions.findMany({
      where: { customerId },
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });

    // 4. Offers
    const offers = tenantId
      ? await this.prisma.customer_offers.findMany({
          where: {
            tenantId,
            isActive: true,
          },
          orderBy: { createdAt: 'desc' },
        })
      : [];

    // 5. Recent Payments
    const payments = await this.prisma.payment_transactions.findMany({
      where: { customerId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    // 6. Tickets & Timeline
    const tickets = await this.prisma.crm_tickets.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });

    const timeline = await this.prisma.customer_timeline.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const name = customer.profile
      ? `${customer.profile.firstName || ''} ${customer.profile.lastName || ''}`.trim() ||
        customer.profile.displayName ||
        'Unknown'
      : 'Unknown';

    const email = customer.contacts.find((c) => c.type === 'PRIMARY_EMAIL')?.value || null;
    const phone = phoneContact || customer.contacts[0]?.value || null;

    return {
      customerId,
      customerDetails: {
        name,
        email,
        phone,
        status: customer.status,
        customerCode: customer.customerCode,
        identityType: customer.identityType,
        lifecycleStage: customer.lifecycleStage,
        source: customer.externalSystem || 'DIRECT',
        language: customer.preferences?.language || 'en',
        createdAt: customer.createdAt,
        addresses: customer.addresses,
        tags: customer.tagMappings.map((tm) => tm.tag.name),
        notes: customer.notes,
      },
      metrics: {
        totalSpending: Number(totalSpending.toFixed(2)),
        totalVisits,
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        lifetimeValue: Number(lifetimeValue.toFixed(2)),
        firstVisit,
        lastVisit,
        segment,
      },
      loyaltySummary: {
        tier: currentTier,
        pointsTotal: crmLoyalty.pointsTotal,
        status: crmLoyalty.isActive ? 'ACTIVE' : 'INACTIVE',
        ledger: crmLoyalty.ledger || [],
      },
      rewards: {
        available: availableRewards,
        redemptions,
      },
      offers,
      ordersCount: totalVisits,
      recentOrders: [...orders, ...standardOrders].slice(0, 10),
      recentPayments: payments,
      tickets,
      timeline,
    };
  }
}
