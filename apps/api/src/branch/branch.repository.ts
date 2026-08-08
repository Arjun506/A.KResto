import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateBranchDto) {
    const code = dto.code || `BR-${Date.now().toString(36).toUpperCase()}`;
    return this.prisma.branch.create({
      data: {
        tenantId,
        name: dto.name,
        code,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        location: dto.location,
        latitude: dto.latitude,
        longitude: dto.longitude,
        operatingHours: dto.operatingHours || undefined,
        timezone: dto.timezone || 'UTC',
        currency: dto.currency || 'INR',
        status: dto.status || 'ACTIVE',
        managerId: dto.managerId,
        industryType: dto.industryType || 'RESTAURANT',
      },
    });
  }

  async findAll(tenantId: string, filters?: { status?: string; industryType?: string }) {
    const where: any = { tenantId };
    if (filters?.status) where.status = filters.status;
    if (filters?.industryType) where.industryType = filters.industryType;

    return this.prisma.branch.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.branch.findFirst({
      where: { id, tenantId },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateBranchDto) {
    return this.prisma.branch.updateMany({
      where: { id, tenantId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude }),
        ...(dto.operatingHours !== undefined && { operatingHours: dto.operatingHours }),
        ...(dto.timezone && { timezone: dto.timezone }),
        ...(dto.currency && { currency: dto.currency }),
        ...(dto.status && { status: dto.status }),
        ...(dto.managerId !== undefined && { managerId: dto.managerId }),
        ...(dto.industryType && { industryType: dto.industryType }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async findNearby(latitude: number, longitude: number, radiusKm = 10, industryType?: string) {
    // For universal search across active branches
    const where: any = { isActive: true, status: 'ACTIVE' };
    if (industryType) where.industryType = industryType;

    const branches = await this.prisma.branch.findMany({
      where,
      include: {
        tenant: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // Haversine distance calculation
    return branches
      .map((b) => {
        if (!b.latitude || !b.longitude) return null;
        const R = 6371; // Earth radius in km
        const dLat = ((b.latitude - latitude) * Math.PI) / 180;
        const dLon = ((b.longitude - longitude) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((latitude * Math.PI) / 180) *
            Math.cos((b.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;

        return {
          ...b,
          distanceKm: Number(distanceKm.toFixed(2)),
        };
      })
      .filter((b): b is NonNullable<typeof b> => b !== null && b.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }
}
