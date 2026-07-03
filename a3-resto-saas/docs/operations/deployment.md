# Deployment & CI/CD Guidelines

This document presents the deployment structures and pipeline configurations for **AK Business OS**.

## 1. Local Containerized Development

We use Docker to run development environments locally:
- **`docker-compose.yml`** initializes the PostgreSQL database and Redis services.
- Env settings are managed via local `.env` files. Ensure you never commit active secrets or keys to the git registry.

## 2. Production Build Pipeline

Both NestJS and NextJS apps are compiled using Multi-stage Dockerfiles:
- **Build Stage:** Installs npm dependencies, hooks Turborepo tasks, compiles TypeScript files, and runs Next.js optimizations.
- **Runner Stage:** Minimizes image size by dropping build dependencies, copying only the compiled output node files to target paths.

## 3. CI/CD Workflows (GitHub Actions)

- **Trigger Policy:** Pipelines run on all Pull Requests targeting `main` and all merges to the primary codebase.
- **Workflow Tasks:**
  - Code analysis and formatting validations (`npm run lint`, `npm run format:check`).
  - Unit and integration tests (`npm run test:unit`, `npm run test:e2e`).
  - Automatic Docker builds and registry pushes upon successful merges.
