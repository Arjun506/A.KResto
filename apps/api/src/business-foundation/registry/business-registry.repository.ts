import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessStatus } from '@prisma/client';

@Injectable()
export class BusinessRegistryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBusinessDto) {
    return this.prisma.businesses.create({
      data: {
        organizationId: dto.organizationId,
        tenantId: dto.tenantId,
        name: dto.name,
        legalName: dto.legalName,
        displayName: dto.displayName,
        code: dto.code,
        industry: dto.industry,
        description: dto.description,
        branding: dto.branding,
        socialLinks: dto.socialLinks,
        metadata: dto.metadata,
        status: BusinessStatus.DRAFT,
        isVerified: false,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.businesses.findFirst({
      where: { id, deletedAt: null },
      include: {
        settings: true,
        ownerships: { where: { isCurrent: true }, include: { user: true } },
        contacts: { where: { deletedAt: null } },
        addresses: { where: { deletedAt: null } },
        attachments: { where: { deletedAt: null } },
        categoryMappings: { include: { category: true } },
        tagMappings: { include: { tag: true } },
      },
    });
  }

  async findDuplicates(name: string, tenantId?: string) {
    return this.prisma.businesses.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
  }

  async updateStatus(id: string, status: BusinessStatus) {
    const isVerified =
      status === BusinessStatus.VERIFIED || status === BusinessStatus.ACTIVE;
    return this.prisma.businesses.update({
      where: { id },
      data: { status, isVerified },
    });
  }

  async softDelete(id: string) {
    return this.prisma.businesses.update({
      where: { id },
      data: { deletedAt: new Date(), status: BusinessStatus.CLOSED },
    });
  }

  async list(tenantId?: string, page: number = 1, limit: number = 20) {
    const where = tenantId
      ? { tenantId, deletedAt: null }
      : { deletedAt: null };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.businesses.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.businesses.count({ where }),
    ]);

    return { items, total };
  }

  async recordTimeline(
    businessId: string,
    eventType: string,
    description: string,
    actorId?: string,
    metadata?: any,
  ) {
    return this.prisma.business_timeline.create({
      data: {
        businessId,
        eventType,
        description,
        actorId,
        metadata,
      },
    });
  }
}
