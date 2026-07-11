import { Injectable } from '@nestjs/common';

@Injectable()
export class ModuleProvisioner {
  // Current DB schema does not have a dedicated "installed modules" table.
  // Modules are represented by tenant_features (capability registry).
  // So this component is intentionally a no-op for now, but kept as an
  // extension point.
  provisionModules(
    _tx: unknown,
    _input: { tenantId: string; industry: string },
  ) {
    return;
  }
}
