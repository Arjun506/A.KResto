import { Injectable, BadRequestException } from '@nestjs/common';

import type { ModuleRegistry } from '../registry/module-registry';

type InstallPlanInput = {
  registry: ModuleRegistry;
  tenantId: string;
  targetModuleId: string;
  targetVersion?: string;
};

@Injectable()
export class DependencyResolver {
  resolveInstallPlan(input: InstallPlanInput): {
    installOrder: Array<{
      moduleId: string;
      version: string;
      config?: unknown;
    }>;
  } {
    // Minimal deterministic resolver:
    // - DFS dependencies
    // - Detect cycles
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const dfs = (moduleId: string) => {
      if (visiting.has(moduleId)) {
        throw new BadRequestException(
          `Dependency cycle detected at ${moduleId}`,
        );
      }
      if (visited.has(moduleId)) return;

      visiting.add(moduleId);
      const mod = input.registry.getModule(moduleId);
      for (const dep of mod.dependencies ?? []) {
        dfs(dep.moduleId);
      }
      visiting.delete(moduleId);
      visited.add(moduleId);
      order.push(moduleId);
    };

    dfs(input.targetModuleId);

    // order currently has dependencies then target
    return {
      installOrder: order.map((moduleId) => {
        const mod = input.registry.getModule(moduleId);
        return {
          moduleId,
          version:
            moduleId === input.targetModuleId && input.targetVersion
              ? input.targetVersion
              : mod.version,
        };
      }),
    };
  }
}
