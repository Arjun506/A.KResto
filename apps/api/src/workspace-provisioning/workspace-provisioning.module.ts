import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceProvisioningService } from './workspace-provisioning.service';

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

@Module({
  providers: [
    WorkspaceProvisioningService,
    PrismaService,
    WorkspaceCreator,
    OwnerCreator,
    BusinessCreator,
    BranchCreator,
    RoleProvisioner,
    ModuleProvisioner,
    DashboardProvisioner,
    AIProvisioner,
    MarketplaceProvisioner,
    ConsumerProvisioner,
    NotificationProvisioner,
    SubscriptionProvisioner,
    AuditProvisioner,
  ],
  exports: [WorkspaceProvisioningService],
})
export class WorkspaceProvisioningModule {}
