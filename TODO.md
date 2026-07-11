# TODO — EPIC OPS-2 (AK Business OS v1.0)

## Sprint 3 Goal

Complete Smart POS & Restaurant Operations workflow (OPS-2 / Epic OPS-2).

## Checklist

- [ ] Backend: EPIC11 socket event contract (bill/payment/invoice/table.updated)
- [ ] Backend: table operations APIs (merge + transfer) replacing UI stubs
- [ ] Backend: split-bill minimal primitive (mapping to orders model)
- [ ] Frontend: wire merge/transfer buttons to real APIs
- [ ] Frontend: replace split calculator with real split checkout flow
- [ ] Backend/Frontend: wallet + tips support + persistence in checkout
- [ ] Backend/Frontend: refunds support (endpoint + socket + UI hooks)
- [ ] Backend/Frontend: daily closing/EOD settlement persistence + UI replacement
- [ ] Tests: workflow tests + socket event mapping tests
- [ ] Build gates: API build + Prisma validate + ESLint; Web build + TS/ESLint
- [ ] Update completion matrix + evidence in Phase trackers
