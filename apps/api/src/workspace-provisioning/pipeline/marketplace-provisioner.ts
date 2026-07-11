import { Injectable } from '@nestjs/common';

@Injectable()
export class MarketplaceProvisioner {
  provisionMarketplace(
    _tx: unknown,
    _input: { tenantId: string; dto: unknown; workspaceSettings: unknown },
  ) {
    // Marketplace profile is stored inside tenant.settings JSON.
    return;
  }
}
