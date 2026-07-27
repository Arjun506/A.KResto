import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AssignOwnershipDto } from './dto/assign-owner.dto';

@Injectable()
export class BusinessOwnershipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async assignOwnership(businessId: string, dto: AssignOwnershipDto) {
    return this.prisma.business_ownership.create({
      data: {
        businessId,
        userId: dto.userId,
        role: dto.role,
        percentage: dto.percentage,
        isCurrent: true,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getCurrentOwners(businessId: string) {
    return this.prisma.business_ownership.findMany({
      where: { businessId, isCurrent: true },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getOwnershipHistory(businessId: string) {
    return this.prisma.business_ownership.findMany({
      where: { businessId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async unassignOwnership(businessId: string, userId: string) {
    return this.prisma.business_ownership.updateMany({
      where: { businessId, userId, isCurrent: true },
      data: { isCurrent: false, unassignedAt: new Date() },
    });
  }
}
