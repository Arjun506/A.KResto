import { BadRequestException, Injectable } from '@nestjs/common';

import { ModuleRegistry } from './registry/module-registry';
import { DependencyResolver } from './resolver/dependency-resolver';
import { ModuleStateService } from './state/module-state.service';
import { ModulePermissionService } from './permissions/module-permission.service';
import { PrismaService } from '../prisma/prisma.service';

type InstallModuleInput = {
  tenantId: string;
  moduleId: string;
  version?: string;
  config?: unknown;
};

type UpdateModuleInput = {
  tenantId: string;
  moduleId: string;
  version?: string;
  config?: unknown;
};

type SetEnabledInput = {
  tenantId: string;
  moduleId: string;
  enabled: boolean;
};

type SidebarInput = {
  tenantId: string;
  role: string;
};

type WidgetsInput = {
  tenantId: string;
  role: string;
};

@Injectable()
export class ModulePlatformService {
  constructor(
    private readonly registry: ModuleRegistry,
    private readonly dependencyResolver: DependencyResolver,
    private readonly state: ModuleStateService,
    private readonly permission: ModulePermissionService,
    private readonly prisma: PrismaService,
  ) {}

  async listAllRegistryModules() {
    return this.registry.listAll();
  }

  async listInstalledModules({ tenantId }: { tenantId: string }) {
    return this.state.listInstalledModules(tenantId);
  }

  async installModule(input: InstallModuleInput) {
    const moduleDef = this.registry.getModule(input.moduleId);

    // Subscription & industry gating
    await this.assertCanEnableModule(input.tenantId, moduleDef);

    const plan = this.dependencyResolver.resolveInstallPlan({
      registry: this.registry,
      tenantId: input.tenantId,
      targetModuleId: input.moduleId,
      targetVersion: input.version,
    });

    // Deterministic order: install dependencies first
    for (const m of plan.installOrder) {
      await this.state.installModule({
        tenantId: input.tenantId,
        moduleId: m.moduleId,
        version: m.version,
        config: m.config,
      });
    }

    // Enable target by default
    await this.state.setModuleEnabled({
      tenantId: input.tenantId,
      moduleId: input.moduleId,
      enabled: true,
    });

    // Update permission requirements for UI actions
    await this.permission.syncModulePermissionsForTenant(
      input.tenantId,
      plan.installOrder,
    );

    return { ok: true, installPlan: plan };
  }

  async uninstallModule({
    tenantId,
    moduleId,
  }: {
    tenantId: string;
    moduleId: string;
  }) {
    const moduleDef = this.registry.getModule(moduleId);
    this.assertCanUninstall(moduleDef);

    // Disable first (preserve data), then mark uninstall
    await this.state.setModuleEnabled({ tenantId, moduleId, enabled: false });
    await this.state.uninstallModule({ tenantId, moduleId });

    return { ok: true };
  }

  async setModuleEnabled({ tenantId, moduleId, enabled }: SetEnabledInput) {
    const moduleDef = this.registry.getModule(moduleId);
    if (enabled) await this.assertCanEnableModule(tenantId, moduleDef);

    await this.state.setModuleEnabled({ tenantId, moduleId, enabled });
    if (enabled) {
      await this.permission.syncModulePermissionsForTenant(tenantId, [
        { moduleId, version: moduleDef.version },
      ]);
    }

    return { ok: true, enabled };
  }

  async updateModule({
    tenantId,
    moduleId,
    version,
    config,
  }: UpdateModuleInput) {
    const moduleDef = this.registry.getModule(moduleId);

    const nextVersion = version ?? moduleDef.version;
    await this.state.installOrUpdateModule({
      tenantId,
      moduleId,
      version: nextVersion,
      config,
    });

    // keep enabled state as-is; permissions may need refresh
    if (await this.state.isModuleEnabled(tenantId, moduleId)) {
      await this.permission.syncModulePermissionsForTenant(tenantId, [
        { moduleId, version: nextVersion },
      ]);
    }

    return { ok: true, version: nextVersion };
  }

  async getSidebarItems({ tenantId, role }: SidebarInput) {
    const installed = await this.state.listInstalledModules(tenantId);

    const items = [] as any[];
    for (const mod of installed) {
      if (!mod.isEnabled) continue;
      const def = this.registry.getModule(mod.moduleId);

      const permitted = def.sidebarItems.filter((si) => {
        if (!si.requiredPermission) return true;
        return this.permission.can(role, si.requiredPermission);
      });

      items.push(...permitted);
    }

    return {
      groups: this.groupByCategory(items),
    };
  }

  async getWidgetsForDashboard({ tenantId, role }: WidgetsInput) {
    const installed = await this.state.listInstalledModules(tenantId);

    const widgets = [] as any[];
    for (const mod of installed) {
      if (!mod.isEnabled) continue;
      const def = this.registry.getModule(mod.moduleId);

      const exposed = def.widgets
        .filter(
          (w) =>
            !w.requiredPermission ||
            this.permission.can(role, w.requiredPermission),
        )
        .filter((w) =>
          this.permission.featureFlagEnabled(tenantId, w.featureFlagKey),
        );

      widgets.push(...exposed);
    }

    return { widgets };
  }

  private async assertCanEnableModule(tenantId: string, moduleDef: any) {
    const activeSub = await this.prisma.subscriptions.findFirst({
      where: { restaurantId: tenantId, status: 'ACTIVE' },
    });
    const currentTier = activeSub?.planName ?? 'TRIAL';

    const tierWeights: Record<string, number> = {
      TRIAL: 0,
      STARTER: 1,
      PROFESSIONAL: 2,
      ENTERPRISE: 3,
    };

    const currentWeight = tierWeights[currentTier] ?? 0;

    const requirements = moduleDef.subscriptionRequirements ?? [];
    for (const req of requirements) {
      if (req.required) {
        const requiredWeight = tierWeights[req.planTier] ?? 0;
        if (currentWeight < requiredWeight) {
          throw new BadRequestException(
            `Module '${moduleDef.moduleName}' requires a minimum subscription plan tier of ${req.planTier}. Your current plan is ${currentTier}. Please upgrade your subscription.`,
          );
        }
      }
    }
  }

  private assertCanUninstall(moduleDef: any) {
    const criticalModules = ['pos-terminal', 'kitchen', 'pos', 'reservations'];
    if (criticalModules.includes(moduleDef.moduleId)) {
      throw new BadRequestException(
        `Module '${moduleDef.moduleName}' is a core system component and cannot be uninstalled.`,
      );
    }
  }

  private groupByCategory(items: any[]) {
    const by = new Map<string, any[]>();
    for (const it of items) {
      const k = it.category ?? 'General';
      if (!by.has(k)) by.set(k, []);
      by.get(k)!.push(it);
    }

    return Array.from(by.entries()).map(([category, groupItems]) => ({
      label: category,
      items: groupItems,
    }));
  }
}
