# TODO_PHASE2_V1_0_RESTAURANT_OPERATIONS_WORKFLOW.md

- [ ] Step 1: Inspect current restaurant-operations dashboard page and identify mock vs API calls.
- [ ] Step 2: Inspect current backend order status workflow mapping (`order-status.ts`) and confirm if states match required workflow.
- [ ] Step 3: Inspect order status transition validation logic and ensure it supports the full KDS→Completed progression.
- [ ] Step 4: Verify inventory deduction hook exists (order completion/transition). If missing, extend in the existing order completion path without redesign.
- [ ] Step 5: Ensure audit_logs are written for each relevant workflow stage change.
- [ ] Step 6: Ensure socket events are emitted for each stage (preparing/ready/completed, plus optional served stage via existing mapping or derived behavior).
- [ ] Step 7: Update frontend to be API-driven with proper loading/error/empty states.
- [ ] Step 8: Add/adjust permissions enforcement for kitchen stage updates, POS checkout/complete, and reports read.
- [ ] Step 9: Add/adjust backend report endpoint(s) if required for “Reports Updated” stage.
- [ ] Step 10: Run build gates: `npm run build` + Prisma validate + ESLint; fix all failures until pass.
- [ ] Step 11: Mark workflow as Complete in Phase 1 tracker (update completion matrix + evidence).
