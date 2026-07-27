# AK OS Kernel Architecture Specification

## Clean Architecture & Domain-Driven Design (DDD)

Every bounded context in the AK OS Kernel adheres to the strict 5-layer pattern:

```
[ HTTP Controller / Swagger ]
          │
          ▼
    [ Service ]
          │
          ▼
   [ Repository ]
          │
          ▼
   [ Prisma / DB ]
```

### Key Principles

1. **Separation of Concerns**: Authentication handles identity verification; IAM handles identity management.
2. **Zero Industry Coupling**: No domain-specific rules exist inside the Kernel.
3. **Event-Driven Micro-Engine**: State mutations emit domain events (`UserCreated`, `TenantCreated`, `RoleAssigned`, `PermissionUpdated`, `LoginSucceeded`, `PasswordChanged`).
4. **Resilient Error Handling**: All HTTP & Database exceptions map to a standard JSON envelope:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error description",
    "details": {}
  },
  "timestamp": "2026-07-21T07:58:00.000Z",
  "traceId": "req-uuid"
}
```
