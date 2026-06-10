const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Querying database...");
  const users = await prisma.users.findMany();
  console.log("USERS:", JSON.stringify(users, null, 2));
  const restaurants = await prisma.restaurants.findMany();
  console.log("RESTAURANTS:", JSON.stringify(restaurants, null, 2));
  const tables = await prisma.tables.findMany();
  console.log("TABLES:", JSON.stringify(tables, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
