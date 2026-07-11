# A3 Resto — Production Deployment Guide

This guide assumes the monorepo layout:

- `apps/api` (NestJS)
- `apps/web` (Next.js)
- reverse proxy: `deploy/nginx/a3-resto.conf`
- `docker-compose.yml` at repo root

## 1) One-time setup on the server (VPS)

1. Install Docker + Docker Compose v2.
2. Install Certbot (if doing SSL with Let’s Encrypt).
3. Create a directory for persistent data (optional; docker volumes handle this).

## 2) Environment variables (recommended: CI secrets + server env)

Set the following (values differ per environment):

```bash
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/a3_resto

# Reverse proxy base for the web client
NEXT_PUBLIC_API_URL=https://api.example.com

# Cloudinary (if enabled)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay (billing)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Stripe (optional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Sentry (optional)
SENTRY_DSN=
```

Note: ensure `DATABASE_URL` used by the API matches the Postgres container networking OR external host.

## 3) Docker deployment

From repo root (`d:/A3 resto`):

```bash
cd "d:/A3 resto"
docker compose up --build -d
```

### Expected URLs

- Web UI: `https://example.com` (via Nginx)
- API: `https://api.example.com/api/*` (via Nginx)
- Socket.IO: `https://api.example.com/socket.io/*`

## 4) Database migrations

If migrations aren’t auto-applied by Prisma, run Prisma migration on the API container or locally, then rebuild.

Recommended approach (manual):

1. `docker compose up -d postgres api`
2. Exec into the API container and run:
   - `npx prisma migrate deploy`
3. Verify Prisma client generated during Docker build.

## 5) SSL (Nginx + Certbot)

The repo currently includes a basic Nginx config without SSL termination.

Option A (host-level Certbot):

1. Stop container port 80 exposure temporarily if needed.
2. Run Certbot against Nginx on the host.
3. Update Nginx config to listen on 443 and add certificate paths.

Option B (containerized certbot + nginx):

- Use a certbot sidecar / shared volume for certificates.

After SSL is set up:

- ensure Nginx forwards:
  - `/api/` -> api
  - `/socket.io/` -> api
  - `/` -> web

## 6) PM2 (optional if you don’t fully rely on Docker)

If you use PM2 instead of docker for production runtime:

```bash
cd apps/api && npm ci && npx prisma generate && npm run build
cd ../web && npm ci && npm run build
cd ../..
pm2 start deploy/pm2/ecosystem.config.cjs
pm2 save
```

Docker is the recommended path for consistent environments.

## 7) Monitoring

- Sentry: verify DSN is set and errors show up.
- Health checks: configure `/health` endpoint (backend) and use an uptime monitor.
- Logging: confirm RequestLoggingInterceptor includes correlation IDs.

## 8) Backups

Use one of these strategies:

- Daily `pg_dump` to S3/backups folder.
- Scheduled `pg_dump` container.
- Enable point-in-time recovery if using managed Postgres.

See `deploy/BACKUP_STRATEGY.md` (create/extend as needed).

## 9) CI/CD

A recommended GitHub Actions pipeline is described in `deploy/CICD_GITHUB_ACTIONS.md`.

## 10) Post-deploy smoke tests

Verify:

- Login
- Dashboard loads
- Orders realtime
- Menu CRUD + image upload
- Inventory operations
- Reservations create/status update
- QR ordering flow
- Billing upgrade/downgrade (test mode)
