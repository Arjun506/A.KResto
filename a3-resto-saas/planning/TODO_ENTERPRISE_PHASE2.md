# TODO_ENTERPRISE_PHASE2 — Enterprise Orders Domain + Tenant Socket Architecture

## Plan-derived steps

1. Create `apps/api/src/orders/` enterprise module structure (module/controller/service/gateway + DTOs).
2. Implement Orders REST CRUD with DTO validation, ApiResponse wrapping, and strict tenant enforcement (SUPER_ADMIN bypass).
3. Implement enum-based status flow validation for required statuses (PENDING → PREPARING → READY → COMPLETED/CANCELLED).
   - Handle Prisma enum value `ACCEPTED` by mapping internally/exposing only required statuses.
4. Implement tenant-scoped Socket.IO rooms:
   - Authenticate socket via JWT during connection
   - auto `socket.join(restaurant:${restaurantId})`
   - emit ONLY with `server.to(room).emit(...)` (no global emits)
5. Implement realtime events: `orderCreated`, `orderUpdated`, `orderDeleted`, `orderStatusChanged` emitted to correct tenant room.
6. Implement disconnect/reconnect and listener cleanup.
7. Integrate OrdersModule + RestaurantsModule into `apps/api/src/app.module.ts` and remove legacy registrations.
8. Fix TypeScript/ESLint/provider typing/socket typing issues introduced by the new architecture.
9. Run `npm run start:dev` and verify:
   - order CRUD works
   - tenant isolation prevents cross-tenant access
   - realtime events update kitchen/waiter/dashboard
   - websocket room isolation works
