# TODO_PHASE2_IMPLEMENTATION_SPRINT3_AK_BUSINESS_OS_V1_0_TODO.md

## OPS-2 EPIC11 (Smart POS) — Sprint 3 Execution Tracker

### Backend (socket + payment + split/merge/transfer + inventory/audit + permissions)

1. [ ] Inspect POS payment/refund requirements vs existing payment/invoice/inventory modules.
2. [ ] Add required socket events to backend contract:
   - [ ] `bill.created`
   - [ ] `bill.updated`
   - [ ] `payment.completed`
   - [ ] `payment.failed`
   - [ ] `table.updated`
   - [ ] `invoice.generated`
         (Keep existing `order*`/`kitchen*` events; add these without removing existing.)
3. [ ] Implement POS payment attempt flow (Cash/Card/UPI/Wallet) so failures can trigger `payment.failed`.
4. [ ] Implement refund endpoint(s) (persist refund state; emit socket events if contract expects them).
5. [ ] Implement split/merge/transfer APIs and wire them to existing orders/order_items logic (no redesign).
6. [ ] Inventory deduction hook at correct workflow point.
7. [ ] Ensure audit log writes for required workflow stages.
8. [ ] Permissions enforcement for POS checkout/settle and kitchen stage transitions.
9. [ ] Add/adjust report/daily closing endpoint used by Daily Closing UI.
10. [ ] Add/update backend workflow tests for:
    - [ ] checkout success emits `bill.created`/`payment.completed`/`invoice.generated`
    - [ ] payment failure emits `payment.failed`
    - [ ] split/merge/transfer emits `table.updated`

### Frontend (POS UI wired to APIs + sockets)

11. [ ] Replace mock POS actions with API-driven flows:
    - [ ] split bill
    - [ ] merge tables
    - [ ] transfer tables
    - [ ] wallet payment option
    - [ ] tips input + persist in checkout/payment metadata
    - [ ] refund action
    - [ ] daily closing button + results display
12. [ ] Integrate Socket.IO listeners for:
    - [ ] `bill.*`
    - [ ] `payment.*`
    - [ ] `table.updated`
    - [ ] `invoice.generated`
13. [ ] Update POS invoice/receipt preview to use backend invoice data (not only local totals).
14. [ ] Run frontend build + fix TS/ESLint.

### Quality gates

15. [ ] Run backend build (`apps/api`) + Prisma validate.
16. [ ] Run frontend build (`apps/web`) + lint.
17. [ ] Update `a3-resto-saas/TODO_PHASE2_IMPLEMENTATION_TRACKER.md` completion matrix with evidence.
