# Prompt Library

This document provides reusable templates for prompting AI coding assistants when working on the **AK Business OS** project.

## 1. Create a New Capability Module

```markdown
Role: Senior NestJS & Prisma Backend Developer
Task: Create a new capability module under libs/capabilities/
Instructions:
- Define the NestJS module, controller, and service files.
- Ensure all endpoints are decorated with @UseGuards(JwtAuthGuard, TenantGuard, FeatureGuard, RolesGuard).
- Define base and extension DTOs using class-validator.
- Hook operations to database access through Prisma, filtering all calls strictly with `tenantId`.
- Expose the module dynamically via the Capability Registry.
- Avoid raw SQL queries.
```

## 2. Refactor Page to Design System Standards

```markdown
Role: Senior UI/UX Frontend Architect
Task: Update app component to align with the Design System
Instructions:
- Use Client Component declarations strictly when handling user events or React hooks.
- Refactor layout properties to adhere to the 8px spacing grid.
- Utilize HSL color utility variables instead of raw hex strings.
- Add responsive grid/flex layout rules to support mobile, tablet, and desktop viewports.
- Embed skeleton component placeholders to display during async load states.
```
