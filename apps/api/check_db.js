const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Querying database...");
  const users = await prisma.users.findMany();
  console.log("USERS:", JSON.stringify(users, null, 2));
  const tenant = await prisma.tenant.findMany();
  console.log("TENANTS:", JSON.stringify(tenant, null, 2));
  const tables = await prisma.tables.findMany();
  console.log("TABLES:", JSON.stringify(tables, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
