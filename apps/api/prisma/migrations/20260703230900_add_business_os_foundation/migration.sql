-- Migration: add_business_os_foundation
-- Sprint 1 / Milestone 1A: Business Workspace Provisioning — Database Foundation
-- Date: 2026-07-03
-- Changes:
--   1. Add TenantStatus enum — migrate restaurants.status TEXT → TenantStatus
--   2. Add PlanTier enum — migrate subscriptions.planName TEXT → PlanTier
--   3. Extend branches table with isActive, phone, email, address, code fields
--   4. Add config JSONB column to tenant_features
--   5. Drop unused Role enum
--   6. Add audit_logs.userId FK → users with SetNull + index

-- ─────────────────────────────────────────────
-- 1. Create enums
-- ─────────────────────────────────────────────
CREATE TYPE "TenantStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'CANCELLED', 'ARCHIVED');

CREATE TYPE "PlanTier" AS ENUM ('TRIAL', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE');

-- ─────────────────────────────────────────────
-- 2. Migrate restaurants.status TEXT → TenantStatus
--    Drop default first, change type with USING, restore enum default
-- ─────────────────────────────────────────────
ALTER TABLE "restaurants" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "restaurants"
  ALTER COLUMN "status" TYPE "TenantStatus"
  USING (
    CASE
      WHEN "status" = 'ACTIVE'    THEN 'ACTIVE'::"TenantStatus"
      WHEN "status" = 'PENDING'   THEN 'PENDING'::"TenantStatus"
      WHEN "status" = 'SUSPENDED' THEN 'SUSPENDED'::"TenantStatus"
      WHEN "status" = 'CANCELLED' THEN 'CANCELLED'::"TenantStatus"
      WHEN "status" = 'ARCHIVED'  THEN 'ARCHIVED'::"TenantStatus"
      ELSE 'ACTIVE'::"TenantStatus"
    END
  );

ALTER TABLE "restaurants" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'::"TenantStatus";

-- ─────────────────────────────────────────────
-- 3. Migrate subscriptions.planName TEXT → PlanTier
--    Drop default first, change type with USING, restore enum default
-- ─────────────────────────────────────────────
ALTER TABLE "subscriptions" ALTER COLUMN "planName" DROP DEFAULT;

ALTER TABLE "subscriptions"
  ALTER COLUMN "planName" TYPE "PlanTier"
  USING (
    CASE
      WHEN "planName" = 'TRIAL'        THEN 'TRIAL'::"PlanTier"
      WHEN "planName" = 'STARTER'      THEN 'STARTER'::"PlanTier"
      WHEN "planName" = 'PROFESSIONAL' THEN 'PROFESSIONAL'::"PlanTier"
      WHEN "planName" = 'ENTERPRISE'   THEN 'ENTERPRISE'::"PlanTier"
      ELSE 'TRIAL'::"PlanTier"
    END
  );

ALTER TABLE "subscriptions" ALTER COLUMN "planName" SET DEFAULT 'TRIAL'::"PlanTier";

-- ─────────────────────────────────────────────
-- 4. Extend branches table
-- ─────────────────────────────────────────────
ALTER TABLE "branches"
  ADD COLUMN "code"     TEXT,
  ADD COLUMN "address"  TEXT,
  ADD COLUMN "phone"    TEXT,
  ADD COLUMN "email"    TEXT,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Partial unique index: one code per tenant (only enforced for non-null codes)
CREATE UNIQUE INDEX "branches_restaurantId_code_key"
  ON "branches"("restaurantId", "code")
  WHERE "code" IS NOT NULL;

-- ─────────────────────────────────────────────
-- 5. Add config column to tenant_features
-- ─────────────────────────────────────────────
ALTER TABLE "tenant_features"
  ADD COLUMN "config" JSONB;

-- ─────────────────────────────────────────────
-- 6. Drop unused Role enum
-- ─────────────────────────────────────────────
DROP TYPE IF EXISTS "Role";

-- ─────────────────────────────────────────────
-- 7. Add audit_logs.userId FK → users (SetNull)
-- ─────────────────────────────────────────────
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

ALTER TABLE "audit_logs"
  ADD CONSTRAINT "audit_logs_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
