import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardProvisioner {
  provisionDashboard(
    _tx: unknown,
    _input: { tenantId: string; workspaceSettings: unknown },
  ) {
    // Dashboard layout is stored inside tenant.settings JSON.
    return;
  }
}
