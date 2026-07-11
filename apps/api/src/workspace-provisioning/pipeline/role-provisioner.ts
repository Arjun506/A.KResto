import { Injectable } from '@nestjs/common';
import {
  DEFAULT_ROLE_PERMISSIONS,
  INDUSTRY_ROLE_MAP,
} from '../../business/business.constants';

@Injectable()
export class RoleProvisioner {
  async provisionDefaultRoles(
    tx: any,

    input: { tenantId: string; industry: string },
  ) {
    const { tenantId, industry } = input;

    const rolesPermissions =
      INDUSTRY_ROLE_MAP[industry] ?? DEFAULT_ROLE_PERMISSIONS;

    for (const rp of rolesPermissions) {
      await (
        tx as {
          roles_permissions: { create: (args: any) => Promise<unknown> };
        }
      ).roles_permissions.create({
        data: { tenantId, roleName: rp.role, permissions: rp.perms },
      });
    }

    return rolesPermissions;
  }
}
