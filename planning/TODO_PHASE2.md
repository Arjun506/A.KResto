# A3 RESTO — TODO_PHASE2 (Validation/DTO/Errors)

## Step 1: Global plumbing

- [ ] Update `apps/api/src/main.ts` with global `ValidationPipe` (whitelist/forbidNonWhitelisted/transform)
- [ ] Register global exception filters (Http, Validation, Prisma, Unknown)
- [ ] Register `RequestLoggingInterceptor`

## Step 2: Standard API response + filters

- [ ] Ensure `apiSuccess/apiError` fully match required response schema
- [ ] Refactor exception filters to always return `{ success:false, message?, error? }`

## Step 3: DTO decorators + typing

- [ ] Add `class-validator` / `class-transformer` decorators to `auth/dto/register.dto.ts` and `auth/dto/login.dto.ts`
- [ ] Create restaurant DTOs and refactor `restaurants.controller.ts` to use them
- [ ] Refactor `app.controller.ts` demo endpoint to either validate DTOs and/or align response schema

## Step 4: Prisma error mapping

- [ ] Harden `prisma-error.mapper.ts` + ensure `PrismaExceptionFilter` uses standardized format

## Step 5: Guards + request typing

- [ ] Update `TenantGuard` and `RolesGuard` to use shared request user/tenant types

## Step 6: Socket.IO typing cleanup (minimal)

- [ ] Refactor `orders.gateway.ts` to avoid `any` in event handlers

## Step 7: Verification

- [ ] Run `npm run start:dev` cleanly under `apps/api`
- [ ] Verify happy path + validation error responses
