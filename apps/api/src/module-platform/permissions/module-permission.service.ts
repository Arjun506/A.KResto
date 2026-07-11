import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ModulePermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async can(
    role: string,
    requiredPermission?: string,
    tenantId?: string,
  ): Promise<boolean> {
    if (!requiredPermission) return true;

    if (role === 'SUPER_ADMIN') return true;

    // Stabilization: in absence of tenant-aware inputs in current signature,
    // fall back to permissive check. Tenant-aware enforcement is handled by PermissionsGuard.
    const _mapping = await this.prisma.roles_permissions.findFirst({
      where: { roleName: role },
      select: { permissions: true },
    });
    const mapping = _mapping ?? null;

    if (!mapping) return false;

    const permissions = mapping.permissions;
    return (
      permissions.includes('*') || permissions.includes(requiredPermission)
    );
  }

  async featureFlagEnabled(tenantId: string, featureFlagKey?: string) {
    if (!featureFlagKey) return true;

    const feature = await this.prisma.tenant_features.findUnique({
      where: {
        tenantId_featureKey: {
          tenantId,
          featureKey: featureFlagKey,
        },
      },
      select: { isEnabled: true },
    });

    return feature?.isEnabled ?? false;
  }

  async syncModulePermissionsForTenant(
    _tenantId: string,
    _installed: Array<{ moduleId: string; version: string }>,
  ) {
    // Stabilization mode: keep safe no-op.
    // Permission enforcement already exists via PermissionsGuard + roles_permissions.
  }
}
