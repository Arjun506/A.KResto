import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('654321', 10);

  // 1. Create default Tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'rest-1' },
    update: {},
    create: {
      id: 'rest-1',
      name: 'AKresto',
      slug: 'akresto',
      timezone: 'UTC',
      currency: 'USD',
      isActive: true,
      industry: 'RESTAURANT',
    },
  });

  // 2. Enable default features for this tenant
  const features = ['pos', 'crm', 'inventory', 'analytics', 'reservations'];
  for (const f of features) {
    await prisma.tenant_features.upsert({
      where: {
        tenantId_featureKey: {
          tenantId: 'rest-1',
          featureKey: f,
        },
      },
      update: {},
      create: {
        tenantId: 'rest-1',
        featureKey: f,
        isEnabled: true,
      },
    });
  }

  // 3. Create default Users
  const defaultUsers = [
    {
      id: 'admin-id',
      name: 'Super Admin',
      email: 'admin@restobill.com',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN' as const,
      restaurantId: null,
    },
    {
      id: 'admin-console-id',
      name: 'Super Admin Console',
      email: 'admin.console',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN' as const,
      restaurantId: null,
    },
    {
      id: 'owner-id',
      name: 'Restaurant Owner',
      email: 'owner@restobill.com',
      passwordHash: hashedPassword,
      role: 'RESTAURANT_OWNER' as const,
      restaurantId: 'rest-1',
    },
    {
      id: 'owner-akresto-id',
      name: 'Restaurant Owner (AKresto)',
      email: 'owner@akresto.com',
      passwordHash: hashedPassword,
      role: 'RESTAURANT_OWNER' as const,
      restaurantId: 'rest-1',
    },
    {
      id: 'billing-akresto-id',
      name: 'Billing Staff',
      email: 'billing@akresto.com',
      passwordHash: hashedPassword,
      role: 'CASHIER' as const,
      restaurantId: 'rest-1',
    },
    {
      id: 'waiter-akresto-id',
      name: 'Waiter Staff',
      email: 'waiter@akresto.com',
      passwordHash: hashedPassword,
      role: 'WAITER' as const,
      restaurantId: 'rest-1',
    },
    {
      id: 'chef-akresto-id',
      name: 'Chef Staff',
      email: 'chef@akresto.com',
      passwordHash: hashedPassword,
      role: 'CHEF' as const,
      restaurantId: 'rest-1',
    },
  ];

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

  console.log('Database seeded successfully 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
