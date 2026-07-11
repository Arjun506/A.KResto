import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listRoles(tenantId: string) {
    return this.prisma.roles_permissions.findMany({
      where: { tenantId },
    });
  }

  async upsertRole(tenantId: string, dto: CreateRoleDto) {
    return this.prisma.roles_permissions.upsert({
      where: {
        tenantId_roleName: {
          tenantId,
          roleName: dto.roleName.toUpperCase(),
        },
      },
      update: {
        permissions: dto.permissions,
      },
      create: {
        tenantId,
        roleName: dto.roleName.toUpperCase(),
        permissions: dto.permissions,
      },
    });
  }

  async assignRole(tenantId: string, dto: AssignRoleDto) {
    // 1. Verify user belongs to tenant
    const user = await this.prisma.users.findFirst({
      where: { id: dto.userId, restaurantId: tenantId },
    });
    if (!user) {
      throw new BadRequestException('User not found in this workspace');
    }

    // 2. Verify role exists in custom registry
    const roleExists = await this.prisma.roles_permissions.findUnique({
      where: {
        tenantId_roleName: {
          tenantId,
          roleName: dto.roleName.toUpperCase(),
        },
      },
    });
    if (!roleExists) {
      throw new BadRequestException(
        `Role "${dto.roleName}" is not configured for this workspace`,
      );
    }

    // 3. Map to database UserRole enum
    const enumValues = [
      'SUPER_ADMIN',
      'RESTAURANT_OWNER',
      'MANAGER',
      'CASHIER',
      'WAITER',
      'CHEF',
      'CUSTOMER',
    ];
    const targetEnum = enumValues.includes(dto.roleName.toUpperCase())
      ? (dto.roleName.toUpperCase() as any)
      : 'CASHIER';

    // 4. Update
    const updatedUser = await this.prisma.users.update({
      where: { id: dto.userId },
      data: {
        role: targetEnum,
      },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };
  }
}
