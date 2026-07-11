import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditProvisioner {
  async auditProvisioned(
    tx: unknown,
    input: {
      tenantId: string;
      ownerId: string;
      features: string[];
      rolesPermissions: Array<{ role: string; perms: string[] }>;
    },
  ) {
    const { tenantId, ownerId, features, rolesPermissions } = input;

    await (
      tx as { audit_logs: { create: (args: any) => Promise<unknown> } }
    ).audit_logs.create({
      data: {
        restaurantId: tenantId,
        userId: ownerId,
        entity: 'Tenant',
        entityId: tenantId,
        action: 'WORKSPACE_PROVISIONED',
        changes: [
          'provisioned workspace context',
          'seeded default settings',
          `initialized ${features.length} modules`,
          `configured ${rolesPermissions.length} roles`,
        ],
      },
    });
  }
}
