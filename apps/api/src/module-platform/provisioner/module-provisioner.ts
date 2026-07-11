import { Injectable } from '@nestjs/common';

import { ModulePlatformService } from '../module-platform.service';

@Injectable()
export class ModuleProvisioner {
  constructor(private readonly modulePlatform: ModulePlatformService) {}

  async provisionModules(
    tx: unknown,
    input: { tenantId: string; industry: string },
  ) {
    // tx integration pending; for now, provision a minimal set of core modules.
    // This keeps backward compatibility with workspace provisioning.
    const tenantId = input.tenantId;

    await this.modulePlatform.setModuleEnabled({
      tenantId,
      moduleId: 'dashboard-home',
      enabled: true,
    });
  }
}
