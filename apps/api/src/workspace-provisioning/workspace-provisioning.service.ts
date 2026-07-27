import { BadRequestException, Injectable } from '@nestjs/common';
import { PlanTier, UserRole } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import type { CreateWorkspaceDto } from '../business/dto/create-workspace.dto';
import type { WorkspaceProvisionResponse } from '../business/models/workspace-provision.response';

import { WorkspaceCreator } from './pipeline/workspace-creator';
import { OwnerCreator } from './pipeline/owner-creator';
import { BusinessCreator } from './pipeline/business-creator';

import { BranchCreator } from './pipeline/branch-creator';
import { RoleProvisioner } from './pipeline/role-provisioner';
import { ModuleProvisioner } from './pipeline/module-provisioner';
import { DashboardProvisioner } from './pipeline/dashboard-provisioner';
import { AIProvisioner } from './pipeline/ai-provisioner';
import { MarketplaceProvisioner } from './pipeline/marketplace-provisioner';
import { ConsumerProvisioner } from './pipeline/consumer-provisioner';
import { NotificationProvisioner } from './pipeline/notification-provisioner';
import { SubscriptionProvisioner } from './pipeline/subscription-provisioner';
import { AuditProvisioner } from './pipeline/audit-provisioner';

import { JwtService } from '@nestjs/jwt';

import { BusinessService } from '../business/business.service';

export type ProvisioningContext = {
  workspace: {
    id: string;
    slug: string;
    name: string;
    industry: string;
    status: string;
    currency: string;
    timezone: string;
    language: string;
  };
  owner: { id: string; email: string; name: string; role: UserRole };
  branch: { id: string; name: string; code: string | null; isActive: boolean };
  subscription: {
    id: string;
    planName: PlanTier;
    status: string;
    billingEmail: string | null;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  };
  features: string[];
  rolesPermissions: Array<{ role: string; perms: string[] }>;
};

@Injectable()
export class WorkspaceProvisioningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly businessService: BusinessService,

    private readonly workspaceCreator: WorkspaceCreator,
    private readonly businessCreator: BusinessCreator,
    private readonly branchCreator: BranchCreator,
    private readonly ownerCreator: OwnerCreator,
    private readonly roleProvisioner: RoleProvisioner,

    private readonly moduleProvisioner: ModuleProvisioner,
    private readonly dashboardProvisioner: DashboardProvisioner,
    private readonly aiProvisioner: AIProvisioner,
    private readonly marketplaceProvisioner: MarketplaceProvisioner,
    private readonly consumerProvisioner: ConsumerProvisioner,
    private readonly notificationProvisioner: NotificationProvisioner,
    private readonly subscriptionProvisioner: SubscriptionProvisioner,
    private readonly auditProvisioner: AuditProvisioner,
  ) {}

  async provisionWorkspace(
    dto: CreateWorkspaceDto,
  ): Promise<WorkspaceProvisionResponse> {
    // Note: we keep behavior consistent with existing BusinessService.createWorkspace.
    // All writes are inside ONE transaction.

    const nameCheck = await this.businessService.checkBusinessName(
      dto.businessName,
    );
    if (!nameCheck.available) {
      throw new BadRequestException(
        nameCheck.reason ?? 'Business name is not available',
      );
    }

    const slug = nameCheck.slug;
    const workspaceSettings =
      this.businessService['buildWorkspaceSettings'](dto);

    // Stabilization: keep provisioning focused; features are derived from existing businessCreator outputs.

    // For now, compute via BusinessService.createWorkspace private behavior by calling createWorkspaceSettings builder.
    // We must keep exact behavior; so we will reconstruct from constants in pipeline stages.

    const result = await this.prisma.$transaction(async (tx) => {
      // 1) Workspace (tenant + settings)
      const workspace = await this.workspaceCreator.createWorkspace(tx, {
        dto,
        slug,
        workspaceSettings,
      });

      // 2) Business (tenant_features)
      const business = await this.businessCreator.createBusiness(tx, {
        tenantId: workspace.id,
        industry: dto.industry,
        workspaceName: dto.businessName,
      });

      // 3) Default Branch
      const branch = await this.branchCreator.createDefaultBranch(tx, {
        tenantId: workspace.id,
        location: dto.location ?? null,
      });

      // 4) Owner
      const owner = await this.ownerCreator.createOwner(tx, {
        tenantId: workspace.id,
        dto,
      });

      // 5) Default Roles/Permissions
      const rolesPermissions = await this.roleProvisioner.provisionDefaultRoles(
        tx,
        {
          tenantId: workspace.id,
          industry: dto.industry,
        },
      );

      // 6) Modules (capability/module installation)
      await this.moduleProvisioner.provisionModules(tx, {
        tenantId: workspace.id,
        industry: dto.industry,
      });

      // Pipeline components that map to settings JSON / tenant_features toggles (no extra tables in current schema)
      // are kept as isolated steps for future extension.
      await this.dashboardProvisioner.provisionDashboard(tx, {
        tenantId: workspace.id,
        workspaceSettings,
      });
      await this.aiProvisioner.provisionAI();
      await this.marketplaceProvisioner.provisionMarketplace(tx, {
        tenantId: workspace.id,
        dto,
        workspaceSettings,
      });
      await this.consumerProvisioner.provisionConsumer(tx, {
        tenantId: workspace.id,
        dto,
        workspaceSettings,
      });
      await this.notificationProvisioner.provisionNotifications(tx, {
        tenantId: workspace.id,
        workspaceSettings,
      });

      // 7) Subscription
      const subscription =
        await this.subscriptionProvisioner.provisionSubscription(tx, {
          tenantId: workspace.id,
          billingEmail: dto.ownerEmail,
          plan: dto.selectedPlan ?? PlanTier.TRIAL,
        });

      // 8) Audit Log
      await this.auditProvisioner.auditProvisioned(tx, {
        tenantId: workspace.id,
        ownerId: owner.id,
        features: business.features,
        rolesPermissions,
      });

      return {
        workspace,
        owner,
        branch,
        subscription,
        features: business.features,
        rolesPermissions,
      } satisfies ProvisioningContext;
    });

    const payload = {
      sub: result.owner.id,
      email: result.owner.email,
      role: result.owner.role,
      tenantId: result.workspace.id,
    } as const;

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      workspace: result.workspace,
      business: {
        id: result.workspace.id,
        name: result.workspace.name,
        slug: result.workspace.slug,
        industry: result.workspace.industry,
        status: result.workspace.status,
        currency: result.workspace.currency,
        timezone: result.workspace.timezone,
        language: result.workspace.language,
      },
      owner: {
        id: result.owner.id,
        name: result.owner.name,
        email: result.owner.email,
        role: result.owner.role,
        tenantId: result.workspace.id,
      },
      branch: result.branch,
      subscription: result.subscription,
      modules: result.features,
      roles: result.rolesPermissions.map((r) => r.role),
    };
  }
}
