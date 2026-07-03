# Industry Pack #6: Education

## 1. Overview
The Education Pack configures portals for school class registries, student logs, and billing logs.

## 2. Core Configurations & Overrides
- **Business Type:** `EDUCATION`
- **Visual Extensions:** Student directories, semester timelines, and report card lists.
- **Prisma metadata JSONB Mapping:**
  - `gradeLevel`: Class enrollment identifiers (e.g. Grade 10).
  - `tuitionSchedule`: Payment plan identifiers.

## 3. Workflow Modifications
- Automatically generates billing statements on payment deadlines.
- Automatically notifies parents on student absences.
