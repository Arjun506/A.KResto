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

    return this.prisma.customers.create({
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
      },
      include: {
        profile: true,
        contacts: true,
        preferences: true,
        communications: true,
        loyalty: true,
      },
    });
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
        preferences: true,
        communications: true,
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

  async list(tenantId?: string, page: number = 1, limit: number = 20) {
    const where = tenantId
      ? { tenantId, deletedAt: null }
      : { deletedAt: null };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.customers.findMany({
        where,
        skip,
        take: limit,
        include: { profile: true, contacts: { where: { isPrimary: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customers.count({ where }),
    ]);

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
