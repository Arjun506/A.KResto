import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';

@Injectable()
export class BusinessRelationshipsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(sourceBusinessId: string, dto: CreateRelationshipDto) {
    return this.prisma.business_relationships.create({
      data: {
        sourceBusinessId,
        targetBusinessId: dto.targetBusinessId,
        type: dto.type,
        metadata: dto.metadata,
      },
      include: {
        targetBusiness: { select: { id: true, name: true, status: true } },
      },
    });
  }

  async getRelationships(businessId: string) {
    return this.prisma.business_relationships.findMany({
      where: {
        OR: [
          { sourceBusinessId: businessId },
          { targetBusinessId: businessId },
        ],
        deletedAt: null,
      },
      include: {
        sourceBusiness: { select: { id: true, name: true } },
        targetBusiness: { select: { id: true, name: true } },
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.business_relationships.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
