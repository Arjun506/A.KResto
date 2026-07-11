import { PrismaClient, PlanTier, SubscriptionStatus, UserRole, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('654321', 10);

  // ─────────────────────────────────────────────
  // 1. Default Tenant (AKresto workspace)
  // ─────────────────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { id: 'rest-1' },
    update: {},
    create: {
      id: 'rest-1',
      name: 'AKresto',
      slug: 'akresto',
      timezone: 'UTC',
      currency: 'USD',
      language: 'en',
      isActive: true,
      status: 'ACTIVE',
      industry: 'RESTAURANT',
    },
  });

  // ─────────────────────────────────────────────
  // 2. Default Features (capability registry)
  // ─────────────────────────────────────────────
  const features: Array<{ key: string; config?: Record<string, unknown> }> = [
    { key: 'pos', config: { taxRate: 0.1, printReceipt: true } },
    { key: 'crm', config: { loyaltyEnabled: false } },
    { key: 'inventory', config: { lowStockAlertEnabled: true } },
    { key: 'analytics', config: {} },
    { key: 'reservations', config: { defaultDurationMinutes: 60 } },
    { key: 'kitchen', config: { displayMode: 'GRID' } },
  ];

  for (const f of features) {
    await prisma.tenant_features.upsert({
      where: {
        tenantId_featureKey: {
          tenantId: 'rest-1',
          featureKey: f.key,
        },
      },
      update: {},
      create: {
        tenantId: 'rest-1',
        featureKey: f.key,
        isEnabled: true,
        config: f.config ? (f.config as Prisma.InputJsonObject) : Prisma.JsonNull,
      },
    });
  }

  // ─────────────────────────────────────────────
  // 3. Default Branch
  // ─────────────────────────────────────────────
  await prisma.branch.upsert({
    where: { id: 'branch-1' },
    update: {
      code: 'MAIN',
      isActive: true,
    },
    create: {
      id: 'branch-1',
      tenantId: 'rest-1',
      name: 'Main Branch',
      code: 'MAIN',
      isActive: true,
    },
  });

  // ─────────────────────────────────────────────
  // 4. Default Roles & Permissions
  // ─────────────────────────────────────────────
  const defaultRoles: Array<{ role: string; perms: string[] }> = [
    { role: 'OWNER', perms: ['*'] },
    { role: 'MANAGER', perms: ['*'] },
    { role: 'CASHIER', perms: ['pos:read', 'pos:write', 'payments:read', 'payments:write'] },
    { role: 'WAITER', perms: ['tables:read', 'orders:read', 'orders:write'] },
    { role: 'CHEF', perms: ['kitchen:read', 'kitchen:write', 'inventory:read'] },
  ];

  for (const r of defaultRoles) {
    await prisma.roles_permissions.upsert({
      where: {
        tenantId_roleName: {
          tenantId: 'rest-1',
          roleName: r.role,
        },
      },
      update: {},
      create: {
        tenantId: 'rest-1',
        roleName: r.role,
        permissions: r.perms,
      },
    });
  }

  // ─────────────────────────────────────────────
  // 5. Default Subscription (TRIAL plan)
  // ─────────────────────────────────────────────
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 30);

  await prisma.subscriptions.upsert({
    where: { id: 'sub-1' },
    update: {},
    create: {
      id: 'sub-1',
      restaurantId: 'rest-1',
      planName: PlanTier.TRIAL,
      status: SubscriptionStatus.TRIALING,
      billingEmail: 'owner@akresto.com',
      currentPeriodStart: startDate,
      currentPeriodEnd: endDate,
    },
  });

  // ─────────────────────────────────────────────
  // 6. Default Users
  // ─────────────────────────────────────────────
  const defaultUsers: Array<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    restaurantId: string | null;
  }> = [
    {
      id: 'admin-id',
      name: 'Super Admin',
      email: 'admin@restobill.com',
      passwordHash: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      restaurantId: null,
    },
    {
      id: 'admin-console-id',
      name: 'Super Admin Console',
      email: 'admin.console@restobill.com',
      passwordHash: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      restaurantId: null,
    },
    {
      id: 'owner-id',
      name: 'Restaurant Owner',
      email: 'owner@restobill.com',
      passwordHash: hashedPassword,
      role: UserRole.RESTAURANT_OWNER,
      restaurantId: 'rest-1',
    },
    {
      id: 'owner-akresto-id',
      name: 'Restaurant Owner (AKresto)',
      email: 'owner@akresto.com',
      passwordHash: hashedPassword,
      role: UserRole.RESTAURANT_OWNER,
      restaurantId: 'rest-1',
    },
    {
      id: 'billing-akresto-id',
      name: 'Billing Staff',
      email: 'billing@akresto.com',
      passwordHash: hashedPassword,
      role: UserRole.CASHIER,
      restaurantId: 'rest-1',
    },
    {
      id: 'waiter-akresto-id',
      name: 'Waiter Staff',
      email: 'waiter@akresto.com',
      passwordHash: hashedPassword,
      role: UserRole.WAITER,
      restaurantId: 'rest-1',
    },
    {
      id: 'chef-akresto-id',
      name: 'Chef Staff',
      email: 'chef@akresto.com',
      passwordHash: hashedPassword,
      role: UserRole.CHEF,
      restaurantId: 'rest-1',
    },
  ];

  // Fix legacy malformed 'admin.console' email record if it exists
  await prisma.users.updateMany({
    where: { email: 'admin.console' },
    data: { email: 'admin.console@restobill.com' },
  });

  for (const u of defaultUsers) {
    await prisma.users.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        passwordHash: u.passwordHash,
        role: u.role,
        restaurantId: u.restaurantId,
      },
      create: u,

    });
  }

  // ─────────────────────────────────────────────
  // 7. Seed audit log (workspace bootstrap record)
  // ─────────────────────────────────────────────
  const existingAuditLog = await prisma.audit_logs.findFirst({
    where: { restaurantId: tenant.id, action: 'WORKSPACE_SEEDED' },
  });

  if (!existingAuditLog) {
    const ownerUser = await prisma.users.findUnique({ where: { email: 'owner@akresto.com' } });
    await prisma.audit_logs.create({
      data: {
        restaurantId: tenant.id,
        userId: ownerUser?.id ?? null,
        entity: 'Tenant',
        entityId: tenant.id,
        action: 'WORKSPACE_SEEDED',
        changes: [
          'seeded default tenant',
          'seeded 6 features with config',
          'seeded main branch',
          'seeded 5 roles with permissions',
          'seeded TRIAL subscription',
          'seeded 7 default users',
        ],
      },
    });
  }

  console.log('✅ Database seeded successfully');
  console.log(`   Tenant:       ${tenant.name} (${tenant.id})`);
  console.log(`   Features:     ${features.length} capability features`);
  console.log(`   Branch:       Main Branch [MAIN]`);
  console.log(`   Roles:        ${defaultRoles.length} roles configured`);
  console.log(`   Users:        ${defaultUsers.length} users created`);
  console.log(`   Subscription: TRIAL → TRIALING`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
