import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ModuleRegistry, SUPPORTED_INDUSTRIES, ModuleDefinition } from './registry/module-registry';
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

@Injectable()
export class ModulePlatformService {
  private readonly logger = new Logger(ModulePlatformService.name);

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

  async getIndustries() {
    return SUPPORTED_INDUSTRIES;
  }

  async getRecommendations(industryId: string) {
    const ind = SUPPORTED_INDUSTRIES.find((i) => i.industryId === industryId.toUpperCase());
    if (!ind) {
      throw new BadRequestException(`Unsupported industry type: ${industryId}`);
    }

    const recommendedModuleDefs = ind.recommendedModules.map((mId) => {
      try {
        return this.registry.getModule(mId);
      } catch {
        return null;
      }
    }).filter(Boolean);

    return {
      industry: ind,
      recommendedModules: recommendedModuleDefs,
    };
  }

  async listInstalledModules({ tenantId }: { tenantId: string }) {
    return this.state.listInstalledModules(tenantId);
  }

  async installModule(input: InstallModuleInput) {
    const moduleDef = this.registry.getModule(input.moduleId);

    // Dependency check for required modules
    await this.validateModuleDependencies(input.tenantId, moduleDef);

    const plan = this.dependencyResolver.resolveInstallPlan({
      registry: this.registry,
      tenantId: input.tenantId,
      targetModuleId: input.moduleId,
      targetVersion: input.version,
    });

    for (const m of plan.installOrder) {
      await this.state.installModule({
        tenantId: input.tenantId,
        moduleId: m.moduleId,
        version: m.version,
        config: m.config,
      });
    }

    await this.state.setModuleEnabled({
      tenantId: input.tenantId,
      moduleId: input.moduleId,
      enabled: true,
    });

    await this.permission.syncModulePermissionsForTenant(
      input.tenantId,
      plan.installOrder,
    );

    return { ok: true, installPlan: plan };
  }

  async setModuleEnabled(input: SetEnabledInput) {
    if (input.enabled) {
      const moduleDef = this.registry.getModule(input.moduleId);
      await this.validateModuleDependencies(input.tenantId, moduleDef);
    }

    return this.state.setModuleEnabled(input);
  }

  async uninstallModule({ tenantId, moduleId }: { tenantId: string; moduleId: string }) {
    return this.state.uninstallModule({ tenantId, moduleId });
  }

  async updateModule(input: UpdateModuleInput) {
    return this.state.updateModule(input);
  }

  async getSidebarItems({ tenantId, role }: { tenantId: string; role: string }) {
    const installed = await this.state.listInstalledModules(tenantId);
    const activeModuleIds = new Set(installed.filter((m) => m.isEnabled).map((m) => m.moduleId));

    const all = this.registry.listAll();
    const items: any[] = [];

    for (const mod of all) {
      if (activeModuleIds.has(mod.moduleId)) {
        items.push(...mod.sidebarItems);
      }
    }

    return items;
  }

  async getWidgetsForDashboard({ tenantId, role }: { tenantId: string; role: string }) {
    const installed = await this.state.listInstalledModules(tenantId);
    const activeModuleIds = new Set(installed.filter((m) => m.isEnabled).map((m) => m.moduleId));

    const all = this.registry.listAll();
    const widgets: any[] = [];

    for (const mod of all) {
      if (activeModuleIds.has(mod.moduleId)) {
        widgets.push(...mod.widgets);
      }
    }

    return widgets;
  }

  /**
   * Feature Flag Engine
   */
  async getTenantFeatures(tenantId: string) {
    const features = await this.prisma.tenant_features.findMany({
      where: { tenantId },
    });

    // Default universal feature flags
    const defaults: Record<string, boolean> = {
      AI_BUDDY: true,
      CUSTOMER_APP: true,
      ONLINE_ORDERING: true,
      DELIVERY: true,
      LOYALTY: true,
      WALLET: false,
      PICKUP: true,
      QR_ORDERING: true,
      ADVANCED_ANALYTICS: true,
    };

    for (const f of features) {
      defaults[f.featureKey] = f.isEnabled;
    }

    return defaults;
  }

  async updateTenantFeature(tenantId: string, featureKey: string, isEnabled: boolean, config?: any) {
    return this.prisma.tenant_features.upsert({
      where: {
        tenantId_featureKey: { tenantId, featureKey },
      },
      create: {
        tenantId,
        featureKey,
        isEnabled,
        config: config || undefined,
      },
      update: {
        isEnabled,
        ...(config && { config }),
      },
    });
  }

  /**
   * Universal Discovery APIs for Future AI Buddy & Customer App
   */
  async discoverBranchCapabilities(tenantId: string, branchId?: string) {
    const where: any = { tenantId, status: 'ACTIVE' };
    if (branchId) where.id = branchId;

    const branches = await this.prisma.branch.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        address: true,
        industryType: true,
        latitude: true,
        longitude: true,
        status: true,
      },
    });

    const activeModules = await this.state.listInstalledModules(tenantId);
    const enabledModuleIds = activeModules.filter((m) => m.isEnabled).map((m) => m.moduleId);

    return {
      branches,
      activeModules: enabledModuleIds,
      discoveryContracts: {
        orderingAvailable: enabledModuleIds.includes('pos-terminal'),
        deliveryAvailable: enabledModuleIds.includes('delivery-dispatch'),
        bookingAvailable: enabledModuleIds.includes('salon-booking') || enabledModuleIds.includes('hotel-pms'),
        loyaltyActive: enabledModuleIds.includes('crm-loyalty'),
      },
    };
  }

  private async validateModuleDependencies(tenantId: string, moduleDef: ModuleDefinition) {
    if (!moduleDef.dependencies || moduleDef.dependencies.length === 0) return;

    const installed = await this.state.listInstalledModules(tenantId);
    const activeModuleIds = new Set(installed.filter((m) => m.isEnabled).map((m) => m.moduleId));

    for (const dep of moduleDef.dependencies) {
      if (!activeModuleIds.has(dep.moduleId)) {
        const depDef = this.registry.getModule(dep.moduleId);
        throw new BadRequestException(
          `Module '${moduleDef.moduleName}' requires missing dependency '${depDef.moduleName}' (${dep.moduleId}). Please activate '${depDef.moduleName}' first.`,
        );
      }
    }
  }
}
