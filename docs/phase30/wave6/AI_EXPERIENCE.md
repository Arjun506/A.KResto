# Phase 30 Wave 6 — AI Experience Specifications

---

## Universal AI Copilot & Action Safety Gates

- **Action Classification**:
  - `READ`: Fetch data summaries & reports.
  - `SUGGEST`: Recommend inventory reorder levels / pricing changes.
  - `PREPARE`: Draft purchase orders / customer refunds.
  - `EXECUTE`: Submits transactions. Requires explicit user confirmation gate.
- **Safety Gate**: Consequential actions (financial, stock, staff, medical) render an explicit confirmation modal before executing API mutations.
