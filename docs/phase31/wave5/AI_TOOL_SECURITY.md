# Phase 31 Wave 5 — AI Tool Security

---

## Tool Permissions & Confirmation Gates

- **Tool Classification**:
  - `READ_ONLY`: Search catalog, lookup order, summarize sales.
  - `CONSEQUENTIAL_WRITE`: Refund payment, delete record, change permission, transfer stock.
- **Confirmation Barrier**: Consequential write tools require explicit human user UI confirmation; AI cannot autonomously execute write actions.
