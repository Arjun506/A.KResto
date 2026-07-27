import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { EventBusService } from '../event-bus/event-bus.service';
import {
  PermissionUpdatedEvent,
  RoleAssignedEvent,
} from '../event-bus/events/system.events';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async listRoles(tenantId: string) {
    return this.prisma.roles_permissions.findMany({
      where: { tenantId },
    });
  }

  async upsertRole(tenantId: string, dto: CreateRoleDto) {
    const role = await this.prisma.roles_permissions.upsert({
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

    await this.eventBus.publish(
      new PermissionUpdatedEvent(
        role.roleName,
        { roleName: role.roleName, permissions: role.permissions },
        tenantId,
      ),
    );

    return role;
  }

  async assignRole(tenantId: string, dto: AssignRoleDto) {
    const user = await this.prisma.users.findFirst({
      where: { id: dto.userId, tenantId: tenantId },
    });
    if (!user) {
      throw new BadRequestException('User not found in this workspace');
    }

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

    const validRoles = [
      'SUPER_ADMIN',
      'ADMIN',
      'MANAGER',
      'OPERATOR',
      'STAFF',
      'MEMBER',
      'CUSTOMER',
    ];
    const targetEnum = validRoles.includes(dto.roleName.toUpperCase())
      ? (dto.roleName.toUpperCase() as any)
      : 'CUSTOMER';

    const updatedUser = await this.prisma.users.update({
      where: { id: dto.userId },
      data: {
        role: targetEnum,
      },
    });

    await this.eventBus.publish(
      new RoleAssignedEvent(
        updatedUser.id,
        { userId: updatedUser.id, roleName: dto.roleName },
        tenantId,
      ),
    );

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };
  }
}
