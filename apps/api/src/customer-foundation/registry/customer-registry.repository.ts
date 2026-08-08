import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { CustomerStatus, CustomerLifecycleStage } from '@prisma/client';

@Injectable()
export class CustomerRegistryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: RegisterCustomerDto, creatorId?: string) {
    const customerCode =
      dto.customerCode || `CUST-${Date.now().toString(36).toUpperCase()}`;

    const customer = await this.prisma.customers.create({
      data: {
        tenantId: dto.tenantId,
        userId: dto.userId,
        businessId: dto.businessId,
        customerCode,
        identityType: dto.identityType || 'REGISTERED',
        lifecycleStage: dto.lifecycleStage || 'PROSPECT',
        status: CustomerStatus.ACTIVE,
        externalId: dto.externalId,
        externalSystem: dto.externalSystem,
        createdBy: creatorId,

        profile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            displayName:
              dto.firstName && dto.lastName
                ? `${dto.firstName} ${dto.lastName}`
                : dto.firstName,
            metadata: dto.metadata,
          },
        },
        ...(dto.email && {
          contacts: {
            create: {
              type: 'PRIMARY_EMAIL',
              value: dto.email,
              isPrimary: true,
            },
          },
        }),
        preferences: {
          create: {
            language: 'en',
            currency: 'USD',
            timezone: 'UTC',
          },
        },
        communications: {
          create: {
            emailOptIn: true,
            smsOptIn: true,
            pushOptIn: true,
          },
        },
        loyalty: {
          create: {
            tier: 'BRONZE',
            status: 'ACTIVE',
            pointsBalance: 0,
          },
        },
        crmLoyalty: {
          create: {
            tenantId: dto.tenantId,
            tier: 'NEW',
            pointsTotal: 0,
          },
        },
      },
      include: {
        profile: true,
        contacts: true,
        preferences: true,
        communications: true,
        loyalty: true,
        crmLoyalty: true,
      },
    });

    if (dto.phone) {
      await this.prisma.customer_contacts.create({
        data: {
          customerId: customer.id,
          type: 'MOBILE_PHONE',
          value: dto.phone,
          isPrimary: false,
        },
      });
    }

    const fullCustomer = await this.findById(customer.id);
    return fullCustomer || customer;
  }

  async findById(id: string) {
    return this.prisma.customers.findFirst({
      where: { id, deletedAt: null },
      include: {
        profile: true,
        contacts: { where: { deletedAt: null } },
        addresses: { where: { deletedAt: null } },
        consents: true,
        loyalty: true,
        crmLoyalty: { include: { ledger: { orderBy: { createdAt: 'desc' } } } },
        preferences: true,
        communications: true,
        notes: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
        groupMappings: { include: { group: true } },
        tagMappings: { include: { tag: true } },
      },
    });
  }

  async findDuplicates(email?: string, phone?: string, tenantId?: string) {
    if (!email && !phone) return [];

    return this.prisma.customers.findMany({
      where: {
        ...(tenantId && { tenantId }),
        deletedAt: null,
        contacts: {
          some: {
            value: { in: [email, phone].filter(Boolean) as string[] },
            deletedAt: null,
          },
        },
      },
      include: {
        profile: true,
        contacts: true,
      },
    });
  }

  async updateCustomer(id: string, dto: any, updaterId?: string) {
    if (dto.firstName || dto.lastName || dto.displayName) {
      await this.prisma.customer_profiles.upsert({
        where: { customerId: id },
        create: {
          customerId: id,
          firstName: dto.firstName,
          lastName: dto.lastName,
          displayName: dto.displayName || `${dto.firstName || ''} ${dto.lastName || ''}`.trim(),
        },
        update: {
          ...(dto.firstName && { firstName: dto.firstName }),
          ...(dto.lastName && { lastName: dto.lastName }),
          ...(dto.displayName && { displayName: dto.displayName }),
        },
      });
    }

    return this.prisma.customers.update({
      where: { id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.lifecycleStage && { lifecycleStage: dto.lifecycleStage }),
        updatedBy: updaterId,
      },
      include: {
        profile: true,
        contacts: true,
        addresses: true,
        crmLoyalty: true,
      },
    });
  }

  async addNote(customerId: string, content: string, authorId: string) {
    return this.prisma.customer_notes.create({
      data: {
        customerId,
        authorId,
        content,
        isPrivate: true,
      },
    });
  }

  async updateStatus(id: string, status: CustomerStatus, updaterId?: string) {
    return this.prisma.customers.update({
      where: { id },
      data: { status, updatedBy: updaterId },
    });
  }

  async updateLifecycleStage(
    id: string,
    lifecycleStage: CustomerLifecycleStage,
    updaterId?: string,
  ) {
    return this.prisma.customers.update({
      where: { id },
      data: { lifecycleStage, updatedBy: updaterId },
    });
  }

  async mergeCustomers(
    sourceCustomerId: string,
    targetCustomerId: string,
    actorId?: string,
    reason?: string,
  ) {
    await this.prisma.customer_merge_history.create({
      data: {
        sourceCustomerId,
        targetCustomerId,
        mergedBy: actorId,
        reason,
      },
    });

    return this.prisma.customers.update({
      where: { id: sourceCustomerId },
      data: {
        status: CustomerStatus.CLOSED,
        lifecycleStage: CustomerLifecycleStage.DELETED,
        deletedAt: new Date(),
        updatedBy: actorId,
      },
    });
  }

  async softDelete(id: string, deleterId?: string) {
    return this.prisma.customers.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: CustomerStatus.CLOSED,
        lifecycleStage: CustomerLifecycleStage.DELETED,
        updatedBy: deleterId,
      },
    });
  }

  async list(
    tenantId?: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
    segment?: string,
  ) {
    const where: any = { deletedAt: null };
    if (tenantId) where.tenantId = tenantId;
    if (status) where.status = status;

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { customerCode: { contains: q, mode: 'insensitive' } },
        { profile: { firstName: { contains: q, mode: 'insensitive' } } },
        { profile: { lastName: { contains: q, mode: 'insensitive' } } },
        { profile: { displayName: { contains: q, mode: 'insensitive' } } },
        { contacts: { some: { value: { contains: q, mode: 'insensitive' }, deletedAt: null } } },
      ];
    }

    const skip = (page - 1) * limit;

    const rawItems = await this.prisma.customers.findMany({
      where,
      skip,
      take: limit,
      include: {
        profile: true,
        contacts: { where: { deletedAt: null } },
        addresses: { where: { deletedAt: null } },
        crmLoyalty: true,
        tagMappings: { include: { tag: true } },
        universalOrders: { select: { grandTotal: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.customers.count({ where });

    const items = rawItems.map((c: any) => {
      const name = c.profile
        ? `${c.profile.firstName || ''} ${c.profile.lastName || ''}`.trim() ||
          c.profile.displayName ||
          'Unknown Customer'
        : 'Unknown Customer';
      const email = c.contacts?.find((ct: any) => ct.type === 'PRIMARY_EMAIL')?.value || null;
      const phone = c.contacts?.find((ct: any) => ct.type === 'MOBILE_PHONE' || ct.type === 'WORK_PHONE' || ct.isPrimary)?.value || c.contacts?.[0]?.value || null;
      const ordersCount = c.universalOrders?.length || 0;
      const totalSpending = (c.universalOrders || []).reduce((sum: number, o: any) => sum + Number(o.grandTotal || 0), 0);
      const tier = c.crmLoyalty?.tier || 'NEW';
      const pointsTotal = c.crmLoyalty?.pointsTotal || 0;

      let seg = 'NEW';
      if (tier === 'PLATINUM' || tier === 'GOLD' || totalSpending >= 10000) seg = 'VIP';
      else if (totalSpending >= 5000) seg = 'HIGH_VALUE';
      else if (ordersCount > 5) seg = 'FREQUENT_BUYER';
      else if (ordersCount >= 2) seg = 'RETURNING';

      return {
        id: c.id,
        tenantId: c.tenantId,
        customerCode: c.customerCode,
        name,
        email,
        phone,
        status: c.status,
        lifecycleStage: c.lifecycleStage,
        tier,
        pointsTotal,
        ordersCount,
        totalSpending: Number(totalSpending.toFixed(2)),
        segment: seg,
        tags: (c.tagMappings || []).map((tm: any) => tm.tag?.name).filter(Boolean),
        createdAt: c.createdAt,
      };
    });

    return { items, total };
  }

  async recordTimeline(
    customerId: string,
    eventType: string,
    description: string,
    actorId?: string,
    metadata?: any,
  ) {
    return this.prisma.customer_timeline.create({
      data: {
        customerId,
        eventType,
        description,
        actorId,
        metadata,
      },
    });
  }
}
