# Quick Context

## Current Sprint

- TODO

## Current Goal

- Permanent AI Memory Layer (`ai-context/`) for fast onboarding.

## Completed Modules (high-confidence)

- Frontend: role-based dashboards (billing/kitchen/waiter) + login redesign.
- Backend: NestJS Auth + Orders (tenant + role guards, order status transitions).

## Pending Modules

- Document remaining backend modules and frontend route/component mappings.

## Important Decisions

- Enterprise order contract vs Prisma mapping.
- Tenant isolation enforced server-side.
- Frontend stores JWT in localStorage.

## Architecture Summary

- Monorepo: `apps/api` (NestJS+Prisma+Postgres) + `apps/web` (Next.js+Tailwind+Axios).

## Technology Stack

- NestJS, Prisma, Postgres, Socket.io
- Next.js, React, Tailwind, Recharts, Lucide

## Coding Rules

- Follow `12-AI-RULES.md`

## Current Priority

- Finish populating missing documentation files without changing code.
