import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationProvisioner {
  provisionNotifications(
    _tx: unknown,
    _input: { tenantId: string; workspaceSettings: unknown },
  ) {
    // Notification settings are stored inside tenant.settings JSON.
    return;
  }
}
