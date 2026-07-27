import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class IamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.users.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
        isActive: true,
        profileImageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async createUser(dto: CreateUserDto, passwordHash: string) {
    return this.prisma.users.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        role: (dto.role as any) || 'CUSTOMER',
        tenantId: dto.tenantId,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(id: string, dto: UpdateUserProfileDto) {
    return this.prisma.users.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.profileImageUrl && { profileImageUrl: dto.profileImageUrl }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        profileImageUrl: true,
        updatedAt: true,
      },
    });
  }

  async softDeleteUser(id: string) {
    return this.prisma.users.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async listUsers(tenantId?: string, skip: number = 0, take: number = 20) {
    const where = tenantId
      ? { tenantId, deletedAt: null }
      : { deletedAt: null };
    const [items, total] = await Promise.all([
      this.prisma.users.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          tenantId: true,
          isActive: true,
          createdAt: true,
        },
      }),
      this.prisma.users.count({ where }),
    ]);

    return { items, total };
  }
}
