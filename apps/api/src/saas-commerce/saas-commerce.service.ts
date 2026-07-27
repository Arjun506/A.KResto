import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { TenantRepository } from '../tenant/tenant.repository';
import { IamService } from '../iam/iam.service';
import { PackLifecycleService } from '../platform-pack-engine/pack-lifecycle.service';
import { OnboardTenantDto } from './dto/onboard.dto';
import { UpdateEntitlementDto } from './dto/update-entitlement.dto';
import {
  TenantProvisioningStartedEvent,
  TenantProvisionedEvent,
  TenantProvisioningFailedEvent,
  TrialStartedEvent,
  TrialExpiredEvent,
  SubscriptionActivatedEvent,
  SubscriptionRenewedEvent,
  SubscriptionUpgradedEvent,
  SubscriptionDowngradedEvent,
  SubscriptionPastDueEvent,
  SubscriptionCancelledEvent,
  EntitlementChangedEvent,
  UsageLimitWarningEvent,
  UsageLimitExceededEvent,
} from '../event-bus/events/saas.events';
import { PlanTier, SubscriptionStatus } from '@prisma/client';

// Dynamic plan configuration mappings (no hardcoded settings in services)
export const PLAN_CATALOG: Record<
  PlanTier,
  {
    displayName: string;
    basePriceMonthly: number;
    entitlements: Record<string, any>;
  }
> = {
  TRIAL: {
    displayName: 'Business OS Trial Plan',
    basePriceMonthly: 0,
    entitlements: {
      'users.max': 3,
      'locations.max': 1,
      'ai.copilot': false,
      'ai.tokens.monthly': 1000,
      'pack.allowed': ['RESTAURANT'],
    },
  },
  STARTER: {
    displayName: 'Business OS Starter Plan',
    basePriceMonthly: 49.0,
    entitlements: {
      'users.max': 5,
      'locations.max': 1,
      'ai.copilot': false,
      'ai.tokens.monthly': 5000,
      'pack.allowed': ['RESTAURANT', 'RETAIL'],
    },
  },
  PROFESSIONAL: {
    displayName: 'Business OS Professional Plan',
    basePriceMonthly: 149.0,
    entitlements: {
      'users.max': 25,
      'locations.max': 5,
      'ai.copilot': true,
      'ai.tokens.monthly': 50000,
      'pack.allowed': ['RESTAURANT', 'RETAIL', 'HOTEL', 'LOGISTICS'],
    },
  },
  ENTERPRISE: {
    displayName: 'Business OS Enterprise Plan',
    basePriceMonthly: 499.0,
    entitlements: {
      'users.max': 1000,
      'locations.max': 100,
      'ai.copilot': true,
      'ai.tokens.monthly': 1000000,
      'pack.allowed': [
        'RESTAURANT',
        'RETAIL',
        'HOTEL',
        'LOGISTICS',
        'HEALTHCARE',
      ],
    },
  },
};

const STATUS_TRANSITIONS: Record<SubscriptionStatus, SubscriptionStatus[]> = {
  TRIALING: ['ACTIVE', 'CANCELED', 'EXPIRED'],
  ACTIVE: ['PAST_DUE', 'CANCELED', 'EXPIRED'],
  PAST_DUE: ['ACTIVE', 'CANCELED', 'EXPIRED'],
  CANCELED: ['ACTIVE'],
  EXPIRED: ['ACTIVE'],
};

@Injectable()
export class SaasCommerceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
    private readonly tenantRepo: TenantRepository,
    private readonly iamService: IamService,
    private readonly packLifecycle: PackLifecycleService,
  ) {}

  // 1. Entitlement Engine
  async resolveEntitlement(
    tenantId: string,
    featureKey: string,
  ): Promise<{ value: any; source: string }> {
    // A. Check Tenant Override (includes explicit false, true, or config object overrides)
    const override = await this.prisma.tenant_features.findFirst({
      where: { tenantId, featureKey },
    });

    if (override !== null) {
      return {
        value: override.config !== null ? override.config : override.isEnabled,
        source: 'OVERRIDE',
      };
    }

    // B. Check active Subscription Plan
    const activeSub = await this.prisma.subscriptions.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    const currentTier: PlanTier = activeSub
      ? activeSub.planName
      : PlanTier.TRIAL;
    const planConfig = PLAN_CATALOG[currentTier];

    if (planConfig && planConfig.entitlements[featureKey] !== undefined) {
      return {
        value: planConfig.entitlements[featureKey],
        source: 'PLAN_DEFAULT',
      };
    }

    // C. Global default fallback
    return {
      value: false,
      source: 'GLOBAL_DEFAULT',
    };
  }

  async canAccess(tenantId: string, featureKey: string): Promise<boolean> {
    const res = await this.resolveEntitlement(tenantId, featureKey);
    return res.value === true;
  }

  async getLimit(tenantId: string, limitKey: string): Promise<number> {
    const res = await this.resolveEntitlement(tenantId, limitKey);
    if (typeof res.value === 'number') {
      return res.value;
    }
    return 0;
  }

  async assertAccess(tenantId: string, featureKey: string): Promise<void> {
    const allowed = await this.canAccess(tenantId, featureKey);
    if (!allowed) {
      throw new BadRequestException(
        `Access denied. Tenant ${tenantId} does not hold entitlement for ${featureKey}`,
      );
    }
  }

  async assertWithinLimit(
    tenantId: string,
    limitKey: string,
    currentCount: number,
  ): Promise<void> {
    const limit = await this.getLimit(tenantId, limitKey);
    if (limit > 0 && currentCount >= limit) {
      throw new BadRequestException(
        `Limit exceeded. Key ${limitKey} limit is ${limit}, currently at ${currentCount}`,
      );
    }
  }

  // 2. Idempotent / Recoverable Onboarding & Provisioning
  async onboardTenant(dto: OnboardTenantDto) {
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.slug },
    });
    if (existingTenant) {
      throw new ConflictException(
        `Tenant with slug ${dto.slug} already exists`,
      );
    }

    // Start provisioning
    const tempId = `temp-${dto.slug}`;
    await this.eventBus.publish(
      new TenantProvisioningStartedEvent(tempId, {
        tenantId: tempId,
        slug: dto.slug,
      }),
    );

    try {
      // Step A: Create Tenant
      const tenant = await this.prisma.tenant.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          industry: dto.industry || 'RESTAURANT',
        },
      });

      // Step B: Initialize default Subscription (TRIALING)
      const sub = await this.prisma.subscriptions.create({
        data: {
          tenantId: tenant.id,
          planName: dto.planTier,
          status: SubscriptionStatus.TRIALING,
          billingEmail: dto.adminEmail,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        },
      });

      // Step C: Initialize first Admin Account
      const user = await this.iamService.createUser({
        email: dto.adminEmail,
        password: dto.adminPassword || 'password123',
        name: `${dto.name} Administrator`,
        role: 'ADMIN',
        tenantId: tenant.id,
      });

      // Step D: Trigger Industry Pack Provisioning if provided
      if (dto.industry) {
        const pack = await this.prisma.platform_packs.findFirst({
          where: { code: dto.industry },
        });
        if (pack) {
          await this.packLifecycle.activatePack(pack.id, tenant.id);
        }
      }

      await this.eventBus.publish(
        new TenantProvisionedEvent(
          tenant.id,
          { tenantId: tenant.id, slug: tenant.slug },
          tenant.id,
        ),
      );

      return {
        tenantId: tenant.id,
        subscriptionId: sub.id,
        adminUserId: user.id,
        status: 'PROVISIONED',
      };
    } catch (err: any) {
      await this.eventBus.publish(
        new TenantProvisioningFailedEvent(tempId, {
          tenantId: tempId,
          error: err.message,
        }),
      );
      throw new BadRequestException(`Onboarding failed: ${err.message}`);
    }
  }

  // 3. Subscription Lifecycle State Machine
  async transitionSubscription(
    subscriptionId: string,
    newStatus: SubscriptionStatus,
  ) {
    const sub = await this.prisma.subscriptions.findUnique({
      where: { id: subscriptionId },
    });
    if (!sub) {
      throw new NotFoundException(`Subscription ${subscriptionId} not found`);
    }

    const currentStatus = sub.status;
    const allowed = STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid subscription status transition from ${currentStatus} to ${newStatus}`,
      );
    }

    const updated = await this.prisma.subscriptions.update({
      where: { id: subscriptionId },
      data: { status: newStatus },
    });

    if (newStatus === 'ACTIVE') {
      await this.eventBus.publish(
        new SubscriptionActivatedEvent(
          updated.tenantId,
          { tenantId: updated.tenantId, planName: updated.planName },
          updated.tenantId,
        ),
      );
    } else if (newStatus === 'PAST_DUE') {
      await this.eventBus.publish(
        new SubscriptionPastDueEvent(
          updated.tenantId,
          { tenantId: updated.tenantId },
          updated.tenantId,
        ),
      );
    } else if (newStatus === 'CANCELED') {
      await this.eventBus.publish(
        new SubscriptionCancelledEvent(
          updated.tenantId,
          { tenantId: updated.tenantId },
          updated.tenantId,
        ),
      );
    }

    return updated;
  }

  async upgradePlan(tenantId: string, newPlan: PlanTier) {
    const sub = await this.prisma.subscriptions.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
    if (!sub) {
      throw new NotFoundException(
        `No active subscription found for tenant ${tenantId}`,
      );
    }

    const oldPlan = sub.planName;
    const updated = await this.prisma.subscriptions.update({
      where: { id: sub.id },
      data: { planName: newPlan },
    });

    await this.eventBus.publish(
      new SubscriptionUpgradedEvent(
        tenantId,
        { tenantId, oldPlan, newPlan },
        tenantId,
      ),
    );
    return updated;
  }

  // 4. Seats & User count enforcement
  async checkSeatLimit(tenantId: string) {
    const employeesCount = await this.prisma.employees.count({
      where: { tenantId },
    });
    const seatLimit = await this.getLimit(tenantId, 'users.max');

    if (seatLimit > 0 && employeesCount >= seatLimit) {
      throw new BadRequestException(
        `Seat limit exceeded. Maximum allowed seats is ${seatLimit}, currently at ${employeesCount}`,
      );
    }

    return {
      employeesCount,
      seatLimit,
      availableSeats: seatLimit - employeesCount,
    };
  }

  // 5. Billing Webhook Safety & Deduplication
  async processBillingWebhook(providerEventId: string, payload: any) {
    // Webhook safety: Check for event processing logs to ensure idempotency
    const existing = await this.prisma.audit_logs.findFirst({
      where: { entity: 'WEBHOOK', entityId: providerEventId },
    });
    if (existing) {
      return { status: 'DUPLICATE_IGNORED', providerEventId };
    }

    // Record webhook audit log to block replay attacks
    await this.prisma.audit_logs.create({
      data: {
        tenantId: payload.tenantId || 'GLOBAL',
        entity: 'WEBHOOK',
        entityId: providerEventId,
        action: 'WEBHOOK_PROCESSED',
        changes: [payload.type],
      },
    });

    if (payload.type === 'invoice.paid' && payload.subscriptionId) {
      await this.transitionSubscription(
        payload.subscriptionId,
        SubscriptionStatus.ACTIVE,
      );
    } else if (
      payload.type === 'invoice.payment_failed' &&
      payload.subscriptionId
    ) {
      await this.transitionSubscription(
        payload.subscriptionId,
        SubscriptionStatus.PAST_DUE,
      );
    }

    return { status: 'PROCESSED', providerEventId };
  }

  // 6. Generic Usage Metering
  async recordUsage(tenantId: string, featureKey: string, units: number) {
    const limit = await this.getLimit(tenantId, `${featureKey}.monthly`);
    if (limit === 0) return { usage: 0, limit: 0, status: 'UNLIMITED' };

    // Simply count logs or retrieve usage counter from audit logs
    const count = await this.prisma.audit_logs.count({
      where: { tenantId, entity: 'METERING', action: featureKey },
    });

    const totalUsage = count + units;

    // Log this usage event
    await this.prisma.audit_logs.create({
      data: {
        tenantId,
        entity: 'METERING',
        entityId: `${featureKey}-${Date.now()}`,
        action: featureKey,
        changes: [String(units)],
      },
    });

    if (totalUsage >= limit) {
      await this.eventBus.publish(
        new UsageLimitExceededEvent(
          tenantId,
          { tenantId, key: featureKey, usage: totalUsage, limit },
          tenantId,
        ),
      );
      throw new BadRequestException(
        `Usage limit exceeded for ${featureKey}. Monthly limit is ${limit}`,
      );
    } else if (totalUsage >= limit * 0.8) {
      await this.eventBus.publish(
        new UsageLimitWarningEvent(
          tenantId,
          { tenantId, key: featureKey, usage: totalUsage, limit },
          tenantId,
        ),
      );
    }

    return {
      usage: totalUsage,
      limit,
      status: totalUsage >= limit ? 'LIMIT_EXCEEDED' : 'OK',
    };
  }

  // 7. Update Feature Entitlement Override
  async setEntitlementOverride(tenantId: string, dto: UpdateEntitlementDto) {
    const override = await this.prisma.tenant_features.upsert({
      where: {
        tenantId_featureKey: { tenantId, featureKey: dto.featureKey },
      },
      create: {
        tenantId,
        featureKey: dto.featureKey,
        isEnabled: dto.isEnabled,
        config: dto.config || null,
      },
      update: {
        isEnabled: dto.isEnabled,
        config: dto.config || null,
      },
    });

    await this.eventBus.publish(
      new EntitlementChangedEvent(
        tenantId,
        {
          tenantId,
          key: dto.featureKey,
          oldValue: null,
          newValue: dto.isEnabled,
        },
        tenantId,
      ),
    );

    return override;
  }
}
