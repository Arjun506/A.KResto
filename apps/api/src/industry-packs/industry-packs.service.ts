import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IndustryPackRegistry } from './industry-pack.registry';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IndustryPacksService {
  constructor(
    private readonly registry: IndustryPackRegistry,
    private readonly prisma: PrismaService,
  ) {}

  private async getTenantSettings(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { settings: true, industry: true },
    });
    if (!tenant) {
      throw new NotFoundException('Workspace tenant not found');
    }
    const settings = (tenant.settings as any) || {};
    if (!settings.installedPacks) {
      settings.installedPacks = ['RESTAURANT'];
    }
    if (!settings.enabledPacks) {
      settings.enabledPacks = ['RESTAURANT'];
    }
    return { tenant, settings };
  }

  private async saveTenantSettings(tenantId: string, settings: any) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { settings },
    });
  }

  async listInstalledPacks(tenantId: string) {
    const { settings } = await this.getTenantSettings(tenantId);
    const allPacks = this.registry.listAll();

    return {
      packs: allPacks.map((pack) => {
        const isInstalled = settings.installedPacks.includes(pack.industryKey);
        const isEnabled = settings.enabledPacks.includes(pack.industryKey);

        return {
          name: pack.packName,
          industryKey: pack.industryKey,
          version: pack.version,
          status: isInstalled ? 'Installed' : 'Available',
          enabled: isEnabled,
          navigation: pack.sidebar.navigation,
          permissions: pack.permissions.scope,
          description: pack.description,
        };
      }),
    };
  }

  async installPack(tenantId: string, industryKey: string) {
    const { settings } = await this.getTenantSettings(tenantId);
    const pack = this.registry.getPack(industryKey);

    if (settings.installedPacks.includes(industryKey)) {
      throw new BadRequestException(
        `Industry pack ${industryKey} is already installed`,
      );
    }

    settings.installedPacks.push(industryKey);
    await this.saveTenantSettings(tenantId, settings);

    // Write audit log
    await this.prisma.audit_logs.create({
      data: {
        tenantId: tenantId,
        userId: null,
        entity: 'INDUSTRY_PACK',
        entityId: industryKey,
        action: 'INSTALL',
        changes: [`Installed industry pack ${pack.packName}`],
      },
    });

    return { ok: true, status: 'Installed' };
  }

  async uninstallPack(tenantId: string, industryKey: string) {
    const { settings } = await this.getTenantSettings(tenantId);
    const pack = this.registry.getPack(industryKey);

    if (industryKey === 'RESTAURANT') {
      throw new BadRequestException(
        'Restaurant Industry Pack is a core component and cannot be uninstalled',
      );
    }

    if (!settings.installedPacks.includes(industryKey)) {
      throw new BadRequestException(
        `Industry pack ${industryKey} is not installed`,
      );
    }

    settings.installedPacks = settings.installedPacks.filter(
      (k: string) => k !== industryKey,
    );
    settings.enabledPacks = settings.enabledPacks.filter(
      (k: string) => k !== industryKey,
    );
    await this.saveTenantSettings(tenantId, settings);

    // Write audit log
    await this.prisma.audit_logs.create({
      data: {
        tenantId: tenantId,
        userId: null,
        entity: 'INDUSTRY_PACK',
        entityId: industryKey,
        action: 'UNINSTALL',
        changes: [`Uninstalled industry pack ${pack.packName}`],
      },
    });

    return { ok: true, status: 'Available' };
  }

  async enablePack(tenantId: string, industryKey: string) {
    const { settings } = await this.getTenantSettings(tenantId);
    const pack = this.registry.getPack(industryKey);

    if (!settings.installedPacks.includes(industryKey)) {
      throw new BadRequestException(
        `Industry pack ${industryKey} must be installed before enabling`,
      );
    }

    if (settings.enabledPacks.includes(industryKey)) {
      throw new BadRequestException(
        `Industry pack ${industryKey} is already enabled`,
      );
    }

    settings.enabledPacks.push(industryKey);
    await this.saveTenantSettings(tenantId, settings);

    // Update current active tenant primary industry dynamically (Step 6 Dynamic Nav)
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { industry: industryKey },
    });

    // Write audit log
    await this.prisma.audit_logs.create({
      data: {
        tenantId: tenantId,
        userId: null,
        entity: 'INDUSTRY_PACK',
        entityId: industryKey,
        action: 'ENABLE',
        changes: [
          `Enabled industry pack ${pack.packName}. Set primary industry key to ${industryKey}`,
        ],
      },
    });

    return { ok: true, enabled: true };
  }

  async disablePack(tenantId: string, industryKey: string) {
    const { settings } = await this.getTenantSettings(tenantId);
    const pack = this.registry.getPack(industryKey);

    if (industryKey === 'RESTAURANT') {
      throw new BadRequestException(
        'Restaurant Industry Pack is a core system component and cannot be disabled',
      );
    }

    if (!settings.enabledPacks.includes(industryKey)) {
      throw new BadRequestException(
        `Industry pack ${industryKey} is not enabled`,
      );
    }

    settings.enabledPacks = settings.enabledPacks.filter(
      (k: string) => k !== industryKey,
    );
    await this.saveTenantSettings(tenantId, settings);

    // Revert active primary industry back to RESTAURANT
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { industry: 'RESTAURANT' },
    });

    // Write audit log
    await this.prisma.audit_logs.create({
      data: {
        tenantId: tenantId,
        userId: null,
        entity: 'INDUSTRY_PACK',
        entityId: industryKey,
        action: 'DISABLE',
        changes: [
          `Disabled industry pack ${pack.packName}. Reverted active primary industry key to RESTAURANT`,
        ],
      },
    });

    return { ok: true, enabled: false };
  }

  async updatePack(tenantId: string, industryKey: string, version: string) {
    const { settings } = await this.getTenantSettings(tenantId);
    const pack = this.registry.getPack(industryKey);

    if (!settings.installedPacks.includes(industryKey)) {
      throw new BadRequestException(
        `Industry pack ${industryKey} is not installed`,
      );
    }

    // Write audit log
    await this.prisma.audit_logs.create({
      data: {
        tenantId: tenantId,
        userId: null,
        entity: 'INDUSTRY_PACK',
        entityId: industryKey,
        action: 'UPDATE',
        changes: [
          `Upgraded industry pack ${pack.packName} to version ${version}`,
        ],
      },
    });

    return { ok: true, version };
  }

  getDerivedSidebar(_input: { tenantId: string; role: string }) {
    return { groups: [] };
  }

  getDerivedWidgets(_input: { tenantId: string; role: string }) {
    return { widgets: [] };
  }
}
