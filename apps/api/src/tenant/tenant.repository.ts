import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTenant(dto: CreateTenantDto) {
    return this.prisma.tenant.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        timezone: dto.timezone || 'UTC',
        currency: dto.currency || 'USD',
        branding: dto.branding,
        customDomains: dto.customDomains || [],
        limits: dto.limits,
        metadata: dto.metadata,
        isActive: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.tenant.findFirst({
      where: { id, deletedAt: null },
      include: {
        subscriptions: true,
        tenant_features: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.tenant.findFirst({
      where: { slug, deletedAt: null },
    });
  }

  async softDeleteTenant(id: string) {
    return this.prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async listTenants(skip: number = 0, take: number = 20) {
    const where = { deletedAt: null };
    const [items, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count({ where }),
    ]);
    return { items, total };
  }

  async setFeatureFlag(
    tenantId: string,
    featureKey: string,
    isEnabled: boolean,
    config?: any,
  ) {
    return this.prisma.tenant_features.upsert({
      where: {
        tenantId_featureKey: { tenantId, featureKey },
      },
      create: {
        tenantId,
        featureKey,
        isEnabled,
        config,
      },
      update: {
        isEnabled,
        config,
      },
    });
  }
}
