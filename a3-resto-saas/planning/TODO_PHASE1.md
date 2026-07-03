# A3 RESTO — TODO (Phase 1)

- [x] Create frontend enterprise types under apps/web/src/types/\*
- [x] Refactor web services to use ApiResponse<T> contract
- [x] Update restaurants.service.ts, orders.service.ts, auth.service.ts to remove duplicated types
- [x] Refactor apps/web/services/api.ts to use typed interceptors + JWT injection + 401 logout
- [x] Remove deprecated apps/web/services/types.ts exports
- [x] Add shared API utilities:
  - [x] apps/web/src/services/api-error.ts
  - [x] apps/web/src/services/request.ts
  - [x] apps/web/src/services/response-handler.ts
- [ ] Backend API response standardization + global exception handling (Phase 2)
- [ ] Fix ESLint/TS issues from new request.ts (if any)
