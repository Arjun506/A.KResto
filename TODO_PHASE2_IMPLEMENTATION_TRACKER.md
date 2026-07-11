# TODO_PHASE2_IMPLEMENTATION_TRACKER.md

## Restaurant Operations Engine (AK Business OS v1.0) - Phase 2

- [x] 0. Repo audit already completed (partial): Frontend ops page is mostly mock; backend order service handles status transitions + timeline + socket emits for PREPARING/READY/COMPLETED.

- [x] 1. Backend: inspect `orders/order-status` workflow mapping and confirm required states + transitions (PENDING→PREPARING→READY→SERVED→COMPLETED and invoice/report stages).

- [x] 2. Backend: ensure `SERVED` stage is supported end-to-end (validation + gateway emission + timeline/audit).

- [ ] 3. Backend: ensure inventory deduction hook runs at the correct point (minimal hook into existing completion path).
- [ ] 4. Backend: confirm audit logs (or add minimal writes) for each required stage.
- [ ] 5. Backend: confirm socket event coverage for required stages (add `...Served` / invoice/report if needed).
- [ ] 6. Backend: confirm/implement report endpoint(s) used by “Reports” stage if not already present.
- [ ] 7. Backend: implement/adjust permissions guards for kitchen stage transitions + POS checkout + reports read.
- [ ] 8. Frontend: replace mock placeholders in restaurant operations page with API-driven data.
- [ ] 9. Frontend: implement live Socket.IO updates to keep queue/KDS in sync.
- [ ] 10. Frontend: implement required UI workflow views (Kanban + Timeline + Order Details drawer) within existing page structure.
- [ ] 11. Frontend: implement kitchen assignment + waiter assignment flows (wire to backend endpoints).
- [ ] 12. Frontend: implement payment/invoice status and actions (checkout/mark invoice) aligned with backend transitions.
- [ ] 13. Frontend: ensure responsive layout.
- [ ] 14. Testing: run backend build, Prisma validate, ESLint; add/adjust socket + workflow tests.
- [ ] 15. Testing: run frontend build; fix TS/ESLint issues.
- [x] 16. Update completion matrix + evidence for Phase 1.

## OPS-2 EPIC11 (Smart POS) — sprint evidence

- [x] Audit completed: POS UI exists, but merge/transfer/split/refund/tips/wallet/daily closing are missing; socket billing events missing.
- [x] Implementation plan approved; TODO sprint steps created.
