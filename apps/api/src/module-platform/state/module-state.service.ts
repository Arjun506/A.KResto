import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ModuleStateService {
  constructor(private readonly prisma: PrismaService) {}

  async listInstalledModules(tenantId: string) {
    // In this repo, tenant_modules are represented by tenant_features.
    // We encode module enabled/installed state using featureKey == moduleId.
    const features = await this.prisma.tenant_features.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'asc' },
    });

    return features.map((f) => ({
      moduleId: f.featureKey,
      version:
        typeof f.config === 'object' &&
        f.config !== null &&
        'version' in (f.config as Record<string, unknown>)
          ? (f.config as any).version
          : 'unknown',
      isEnabled: f.isEnabled,
      config: f.config,
    }));
  }

  async isModuleEnabled(tenantId: string, moduleId: string) {
    const f = await this.prisma.tenant_features.findUnique({
      where: {
        tenantId_featureKey: {
          tenantId,
          featureKey: moduleId,
        },
      },
    });
    return !!f?.isEnabled;
  }

  async installModule({
    tenantId,
    moduleId,
    version,
    config,
  }: {
    tenantId: string;
    moduleId: string;
    version: string;
    config?: unknown;
  }) {
    // install == create/ensure tenant_feature exists
    await this.prisma.tenant_features.upsert({
      where: {
        tenantId_featureKey: {
          tenantId,
          featureKey: moduleId,
        },
      },
      update: {
        isEnabled: false,
        config: {
          ...(config ? { moduleConfig: config } : {}),
          version,
        },
      },
      create: {
        tenantId,
        featureKey: moduleId,
        isEnabled: false,
        config: {
          ...(config ? { moduleConfig: config } : {}),
          version,
        },
      },
    });
  }

  async installOrUpdateModule({
    tenantId,
    moduleId,
    version,
    config,
  }: {
    tenantId: string;
    moduleId: string;
    version: string;
    config?: unknown;
  }) {
    await this.prisma.tenant_features.upsert({
      where: {
        tenantId_featureKey: {
          tenantId,
          featureKey: moduleId,
        },
      },
      update: {
        config: {
          ...(config ? { moduleConfig: config } : {}),
          version,
        },
      },
      create: {
        tenantId,
        featureKey: moduleId,
        isEnabled: true,
        config: {
          ...(config ? { moduleConfig: config } : {}),
          version,
        },
      },
    });
  }

  async setModuleEnabled({
    tenantId,
    moduleId,
    enabled,
  }: {
    tenantId: string;
    moduleId: string;
    enabled: boolean;
  }) {
    await this.prisma.tenant_features.upsert({
      where: {
        tenantId_featureKey: {
          tenantId,
          featureKey: moduleId,
        },
      },
      update: {
        isEnabled: enabled,
      },
      create: {
        tenantId,
        featureKey: moduleId,
        isEnabled: enabled,
        config: { version: 'unknown' },
      },
    });
  }

  async uninstallModule({
    tenantId,
    moduleId,
  }: {
    tenantId: string;
    moduleId: string;
  }) {
    // preserve config for now? Requirement says uninstall, so remove it.
    await this.prisma.tenant_features.deleteMany({
      where: { tenantId, featureKey: moduleId },
    });
  }
}
