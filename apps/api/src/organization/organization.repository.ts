import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOrganizationDto,
  CreateBusinessDto,
  CreateLocationDto,
} from './dto/create-organization.dto';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrganization(dto: CreateOrganizationDto) {
    return this.prisma.organizations.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        metadata: dto.metadata,
      },
    });
  }

  async findOrganizationById(id: string) {
    return this.prisma.organizations.findFirst({
      where: { id, deletedAt: null },
      include: {
        businesses: {
          where: { deletedAt: null },
          include: {
            divisions: {
              where: { deletedAt: null },
              include: {
                locations: {
                  where: { deletedAt: null },
                },
              },
            },
          },
        },
      },
    });
  }

  async listOrganizations(tenantId: string) {
    return this.prisma.organizations.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        businesses: {
          where: { deletedAt: null },
        },
      },
    });
  }

  async softDeleteOrganization(id: string) {
    return this.prisma.organizations.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createBusiness(dto: CreateBusinessDto) {
    return this.prisma.businesses.create({
      data: {
        organizationId: dto.organizationId,
        name: dto.name,
        industry: dto.industry,
      },
    });
  }

  async createLocation(dto: CreateLocationDto) {
    return this.prisma.locations.create({
      data: {
        divisionId: dto.divisionId,
        name: dto.name,
        address: dto.address,
      },
    });
  }
}
