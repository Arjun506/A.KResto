# Phase 29K — Staging Deployment Runbook

This runbook details the sequential steps to deploy the staging environment using managed container hosting providers.

---

## 1. Deployment Steps Sequence

1. **Database Setup**: Provision a staging PostgreSQL database on Supabase.
2. **Cache Setup**: Provision an Upstash Redis database instance (obtain host, port, and password credentials).
3. **Configure Environment variables**: Input variables mapped in `STAGING_ENVIRONMENT_MATRIX.md` to Render dashboard.
4. **Deploy NestJS API Service**: Build and deploy `apps/api` using its Dockerfile.
5. **Run Migrations**: Execute `npx prisma migrate deploy` in the build process or as an initialization build command.
6. **Deploy Next.js Web App**: Build and deploy `apps/web` pointing `NEXT_PUBLIC_API_URL` to the generated Render API URL.
7. **Verify Health Probes**: Check `GET /health/live` and `GET /health/ready` on the API domain.
8. **Verify real-time connections**: Confirm WebSockets connect successfully to NestJS.
9. **Pilot Authorization**: Operator approves pilot invitation dispatch via the Pilot Control Center.
