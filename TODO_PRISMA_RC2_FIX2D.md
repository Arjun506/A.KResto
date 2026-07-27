# TODO_PRISMA_RC2_FIX2D

## Step 1 — Root cause analysis (Prisma sync)

- [ ] Inspect prisma.schema.prisma for auth models (otp_sessions, password_reset_tokens, refresh_sessions)
- [ ] Determine whether generated Prisma Client contains those models (via prisma generate / typecheck)
- [ ] Inspect workspace/prisma config: schema path, output path, multiple schemas/packages
- [ ] Inspect PrismaService import: @prisma/client version + prismaClient generation consistency

## Step 2 — Fix (typing synchronization only)

- [ ] Ensure prisma generate uses correct schema.prisma
- [ ] Ensure apps/api uses the generated client from its own node_modules/@prisma/client
- [ ] Clear stale generated artifacts (if any) and re-run prisma generate
- [ ] Adjust prisma service/client import only if necessary (no auth/business logic changes)

## Step 3 — Verify build

- [ ] Run prisma validate
- [ ] Run prisma generate
- [ ] Run backend build
- [ ] Confirm TypeScript compilation sees otp_sessions, password_reset_tokens, refresh_sessions on PrismaService

## Step 4 — Database verification (model existence)

- [ ] Verify migrations include auth models
- [ ] Confirm DB tables exist for otp_sessions, password_reset_tokens, refresh_sessions

## Step 5 — Legacy reference audit

- [ ] Check for remaining references to: otps, resetTokens, activeRefreshTokens

## Step 6 — Final report

- [ ] Summarize root cause, files modified, prisma client status, build status, DB verification, audit results
