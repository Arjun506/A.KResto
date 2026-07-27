import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlanTier } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscriptionStatus(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { subscriptions: true },
    });

    if (!tenant) {
      throw new NotFoundException('Workspace not found');
    }

    const activeSub = tenant.subscriptions[0] || null;
    const planName = activeSub?.planName || PlanTier.TRIAL;
    const status = activeSub?.status || 'ACTIVE';

    // Limits definition mapping
    const planLimits = {
      [PlanTier.TRIAL]: {
        branches: 1,
        users: 5,
        storageGb: 5,
        ordersPerMonth: 500,
      },
      [PlanTier.STARTER]: {
        branches: 1,
        users: 5,
        storageGb: 5,
        ordersPerMonth: 500,
      },
      [PlanTier.PROFESSIONAL]: {
        branches: 5,
        users: 25,
        storageGb: 20,
        ordersPerMonth: 5000,
      },
      [PlanTier.ENTERPRISE]: {
        branches: 999,
        users: 999,
        storageGb: 100,
        ordersPerMonth: 99999,
      },
    };

    const limits = planLimits[planName] || planLimits[PlanTier.TRIAL];

    // Compute actual database usage parameters
    const [userCount, branchCount, orderCount] = await Promise.all([
      this.prisma.users.count({ where: { tenantId: tenantId } }),
      this.prisma.branch.count({ where: { tenantId } }),
      this.prisma.orders.count({ where: { tenantId: tenantId } }),
    ]);

    // Retrieve active license key if saved in settings
    const settings = (tenant.settings as any) || {};
    const licenseKey = settings.licenseKey || 'No active key';

    return {
      planName,
      status,
      currentPeriodStart: activeSub?.currentPeriodStart || tenant.createdAt,
      currentPeriodEnd:
        activeSub?.currentPeriodEnd ||
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      licenseKey,
      limits,
      usage: {
        branches: branchCount,
        users: userCount,
        storageMb: 420, // Simulated database rows bytes size
        ordersThisMonth: orderCount,
      },
    };
  }

  async activateLicenseKey(tenantId: string, licenseKey: string) {
    // Standard validation check: AK-OS-3035-XXXX-XXXX
    const regex = /^AK-OS-3035-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!regex.test(licenseKey)) {
      throw new BadRequestException(
        'Invalid license key format. Expected: AK-OS-3035-XXXX-XXXX',
      );
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Workspace not found');
    }

    const settings = (tenant.settings as any) || {};
    settings.licenseKey = licenseKey;

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        settings,
      },
    });

    // Upgrade subscription to enterprise tier
    const activeSub = await this.prisma.subscriptions.findFirst({
      where: { tenantId: tenantId },
    });

    const now = new Date();
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year key

    if (activeSub) {
      await this.prisma.subscriptions.update({
        where: { id: activeSub.id },
        data: {
          planName: PlanTier.ENTERPRISE,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: expiresAt,
        },
      });
    } else {
      await this.prisma.subscriptions.create({
        data: {
          tenantId: tenantId,
          planName: PlanTier.ENTERPRISE,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: expiresAt,
        },
      });
    }

    // Add audit log
    await this.prisma.audit_logs.create({
      data: {
        tenantId: tenantId,
        userId: null,
        entity: 'LICENSE',
        entityId: licenseKey,
        action: 'ACTIVATE',
        changes: [
          `License key ${licenseKey} activated. Subscription upgraded to ENTERPRISE.`,
        ],
      },
    });

    return { success: true, planName: PlanTier.ENTERPRISE };
  }

  async cancelSubscription(tenantId: string) {
    const activeSub = await this.prisma.subscriptions.findFirst({
      where: { tenantId: tenantId },
    });

    if (!activeSub) {
      throw new NotFoundException('No active subscription found');
    }

    await this.prisma.subscriptions.update({
      where: { id: activeSub.id },
      data: {
        status: 'CANCELED',
      },
    });

    // Add audit log
    await this.prisma.audit_logs.create({
      data: {
        tenantId: tenantId,
        userId: null,
        entity: 'SUBSCRIPTION',
        entityId: activeSub.id,
        action: 'CANCEL',
        changes: ['Subscription auto-renewal cancelled by workspace owner'],
      },
    });

    return { success: true, status: 'CANCELED' };
  }
}
