import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { PERMISSION_KEY } from './require-permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<
      string | string[]
    >(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const req = context.switchToHttp().getRequest<{
      user?: { role: string };
      tenantId?: string;
    }>();

    const user = req.user;
    const tenantId = req.tenantId;

    if (!user) {
      throw new ForbiddenException('User context missing');
    }

    // SUPER_ADMIN overrides all checks
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    if (!tenantId) {
      throw new ForbiddenException('Tenant context missing');
    }

    // Query database for custom tenant-specific roles permissions mapping
    const roleMapping = await this.prisma.roles_permissions.findUnique({
      where: {
        tenantId_roleName: {
          tenantId,
          roleName: user.role,
        },
      },
    });

    if (!roleMapping) {
      throw new ForbiddenException(
        `Role "${user.role}" not configured for this workspace`,
      );
    }

    const permissions = roleMapping.permissions;

    const requiredPermissions = Array.isArray(requiredPermission)
      ? requiredPermission
      : [requiredPermission];

    if (
      permissions.includes('*') ||
      requiredPermissions.some((permission) => permissions.includes(permission))
    ) {
      return true;
    }

    throw new ForbiddenException(
      `Insufficient permissions. Required scope: "${requiredPermissions.join(
        '" or "',
      )}"`,
    );
  }
}
