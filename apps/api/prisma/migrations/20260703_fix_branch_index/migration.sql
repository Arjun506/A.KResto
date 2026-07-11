-- Fix partial unique index on branches to match Prisma schema expectation
-- Prisma generates a standard unique index for @@unique([tenantId, code])
-- Replace the partial WHERE index with a full standard unique index

DROP INDEX IF EXISTS "branches_restaurantId_code_key";

CREATE UNIQUE INDEX "branches_restaurantId_code_key" ON "branches"("restaurantId", "code");
