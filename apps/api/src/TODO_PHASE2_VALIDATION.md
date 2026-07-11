# TODO_PHASE2_VALIDATION

## Phase A — Foundation (approved)

- [ ] Add enterprise `ApiResponse<T>` wrapper + response helpers
- [ ] Add global `ValidationPipe` in `apps/api/src/main.ts`
- [ ] Add global exception filters (HttpException, Validation, Prisma, unknown)
- [ ] Add Prisma error mapping utilities
- [ ] Add request typing: `JwtUser` + tenant-aware request interfaces
- [ ] Update guards/decorators to use shared request/user types
- [ ] Add request/error logging system (interceptor + integration in filters)

## Phase B — DTO audit (next)

- [ ] Audit `auth`, `restaurants`, `orders`, `inventory`, `menu`, `users` endpoints
- [ ] Create/upgrade DTOs with `class-validator` decorators
- [ ] Replace `@Body() any` / unsafe typing with DTOs
- [ ] Standardize controller responses to `{success, data}`

## Dev verification

- [ ] Run `npm run start:dev` cleanly
- [ ] Fix TS errors (no implicit any, no invalid imports, provider wiring)
