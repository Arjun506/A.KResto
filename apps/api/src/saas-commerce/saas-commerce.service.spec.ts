import { Test, TestingModule } from '@nestjs/testing';
import { SaasCommerceService, PLAN_CATALOG } from './saas-commerce.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { TenantRepository } from '../tenant/tenant.repository';
import { IamService } from '../iam/iam.service';
import { PackLifecycleService } from '../platform-pack-engine/pack-lifecycle.service';
import { SubscriptionStatus, PlanTier } from '@prisma/client';

describe('SaasCommerceService', () => {
  let service: SaasCommerceService;
  let prisma: any;
  let eventBus: any;
  let iamService: any;
  let packLifecycle: any;

  beforeEach(async () => {
    prisma = {
      tenant: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
      subscriptions: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      tenant_features: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
      },
      employees: {
        count: jest.fn(),
      },
      audit_logs: {
        create: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
      },
      platform_packs: {
        findFirst: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    iamService = {
      createUser: jest.fn(),
    };

    packLifecycle = {
      activatePack: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaasCommerceService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
        { provide: TenantRepository, useValue: {} },
        { provide: IamService, useValue: iamService },
        { provide: PackLifecycleService, useValue: packLifecycle },
      ],
    }).compile();

    service = module.get<SaasCommerceService>(SaasCommerceService);
  });

  it('should resolve entitlements correctly checking tenant overrides and plan defaults', async () => {
    // 1. Test Override key exists and is explicit false
    prisma.tenant_features.findFirst.mockResolvedValue({
      featureKey: 'ai.copilot',
      isEnabled: false,
      config: null,
    });
    let res = await service.resolveEntitlement('t_1', 'ai.copilot');
    expect(res.value).toEqual(false);
    expect(res.source).toEqual('OVERRIDE');

    // 2. Test Plan default key when override is not present
    prisma.tenant_features.findFirst.mockResolvedValue(null);
    prisma.subscriptions.findFirst.mockResolvedValue({
      planName: PlanTier.PROFESSIONAL,
    });
    res = await service.resolveEntitlement('t_1', 'ai.copilot');
    expect(res.value).toEqual(
      PLAN_CATALOG.PROFESSIONAL.entitlements['ai.copilot'],
    );
    expect(res.source).toEqual('PLAN_DEFAULT');
  });

  it('should onboard a tenant and initialize subscriptions and administrator account', async () => {
    prisma.tenant.findUnique.mockResolvedValue(null);
    prisma.tenant.create.mockResolvedValue({
      id: 't_new',
      name: 'Logistics SA',
      slug: 'logistics-sa',
    });
    prisma.subscriptions.create.mockResolvedValue({
      id: 'sub_new',
      tenantId: 't_new',
      planName: PlanTier.STARTER,
    });
    iamService.createUser.mockResolvedValue({ id: 'user_admin' });
    prisma.platform_packs.findFirst.mockResolvedValue({ id: 'pack_1' });

    const onboard = await service.onboardTenant({
      name: 'Logistics SA',
      slug: 'logistics-sa',
      adminEmail: 'admin@logistics.com',
      planTier: 'STARTER',
      industry: 'LOGISTICS',
    });

    expect(prisma.tenant.create).toHaveBeenCalled();
    expect(onboard.tenantId).toEqual('t_new');
    expect(packLifecycle.activatePack).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
  });

  it('should reject invalid subscription lifecycle transitions', async () => {
    prisma.subscriptions.findUnique.mockResolvedValue({
      id: 'sub_1',
      status: SubscriptionStatus.TRIALING,
    });

    // Transitioning from TRIALING directly to PAST_DUE is invalid according to state machine rules
    await expect(
      service.transitionSubscription('sub_1', SubscriptionStatus.PAST_DUE),
    ).rejects.toThrow();
  });

  it('should block user registration if seat limits are exceeded', async () => {
    prisma.tenant_features.findFirst.mockResolvedValue(null);
    prisma.subscriptions.findFirst.mockResolvedValue({
      planName: PlanTier.STARTER,
    }); // starter max users = 5
    prisma.employees.count.mockResolvedValue(5);

    await expect(service.checkSeatLimit('t_1')).rejects.toThrow();
  });

  it('should handle webhook deduplications ensuring idempotency', async () => {
    prisma.audit_logs.findFirst.mockResolvedValue({ id: 'audit_1' }); // Webhook already processed once

    const hook = await service.processBillingWebhook('evt_123', {
      tenantId: 't_1',
      type: 'invoice.paid',
    });
    expect(hook.status).toEqual('DUPLICATE_IGNORED');
    expect(prisma.audit_logs.create).not.toHaveBeenCalled();
  });

  it('should enforce monthly usage quotas warnings and hard limit blocks', async () => {
    prisma.tenant_features.findFirst.mockResolvedValue(null);
    prisma.subscriptions.findFirst.mockResolvedValue({
      planName: PlanTier.STARTER,
    }); // starter tokens limit = 5000
    prisma.audit_logs.count.mockResolvedValue(4990);

    // Recording 20 units will exceed the 5000 limit
    await expect(service.recordUsage('t_1', 'ai.tokens', 20)).rejects.toThrow();
  });
});
