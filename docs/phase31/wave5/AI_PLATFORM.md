# Phase 31 Wave 5 — AI Platform

---

## Server-Side AI Gateway Architecture

- **AI Gateway Service**: `apps/api/src/ai-platform/ai-gateway.service.ts` routes prompts to model providers.
- **Context Security**: AI prompts are enriched ONLY with data authorized under the requesting user's active tenant and RBAC scope.
