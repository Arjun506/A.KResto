# Phase 29 — Migration Repair Options

This document evaluates remediation pathways to resolve the migration ordering defects.

---

## 1. Options Evaluation

### Option A: Chronological Timestamp Correction (RECOMMENDED)
- **Description**: Rename folders to enforce correct 14-digit integer timestamp order:
  - `20260703_add_business_os_foundation` ➔ `20260703230900_add_business_os_foundation`
  - `20260703_fix_branch_index` ➔ `20260703231000_fix_branch_index`
- **Pros**: Perfectly validates fresh databases; keeps history intact; extremely maintainable.
- **Cons**: Requires staging migration state cleanup (resolving the failed migration entry).
- **Production Impact**: Safe since migrations have not yet been applied to production.

### Option B: Unified Baseline Squash
- **Description**: Squash all 7 migrations into a single baseline migration step `20260727000000_init`.
- **Pros**: One-step initial deployment.
- **Cons**: Erases granular history; makes tracking database version changes harder.

### Option C: Idempotent SQL Modification
- **Description**: Rewrite SQL files to conditionally execute table/column additions if they do not exist.
- **Pros**: Minimizes folder renaming.
- **Cons**: Breaks schema checksum rules of Prisma, leading to validation warnings in future dev environments.
