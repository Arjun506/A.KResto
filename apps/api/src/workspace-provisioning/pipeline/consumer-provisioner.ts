import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsumerProvisioner {
  provisionConsumer(
    _tx: unknown,
    _input: { tenantId: string; dto: unknown; workspaceSettings: unknown },
  ) {
    // Consumer profile is stored inside tenant.settings JSON.
    return;
  }
}
