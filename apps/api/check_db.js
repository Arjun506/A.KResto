const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Querying database...");

  console.log("Querying otp_sessions...");
  try {
    const otps = await prisma.otp_sessions.findMany({ take: 1 });
    console.log("otp_sessions table exists! Count:", otps.length);
  } catch (err) {
    console.error("otp_sessions table error:", err.message);
  }

  console.log("Querying password_reset_tokens...");
  try {
    const tokens = await prisma.password_reset_tokens.findMany({ take: 1 });
    console.log("password_reset_tokens table exists! Count:", tokens.length);
  } catch (err) {
    console.error("password_reset_tokens table error:", err.message);
  }

  console.log("Querying refresh_sessions...");
  try {
    const sessions = await prisma.refresh_sessions.findMany({ take: 1 });
    console.log("refresh_sessions table exists! Count:", sessions.length);
  } catch (err) {
    console.error("refresh_sessions table error:", err.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
