# A3 Resto — Production Checklist (Backend + Frontend)

## 0) Prerequisites

- [ ] Domain(s) configured (example.com, api.example.com)
- [ ] DNS records created
- [ ] TLS/SSL plan decided (Certbot on Nginx container or host)
- [ ] PostgreSQL credentials and storage chosen
- [ ] Redis chosen (for caching/queues)

## 1) Runtime services

- [ ] Docker images build successfully:
  - [ ] apps/api
  - [ ] apps/web
  - [ ] nginx
  - [ ] postgres
  - [ ] redis
- [ ] `docker compose up -d` is green
- [ ] Health checks pass:
  - [ ] API responds on `/health`
  - [ ] Web responds on `/`

## 2) Secrets / environment

- [ ] All required env vars set in VPS/CI secrets
- [ ] No secrets committed to repo
- [ ] `DATABASE_URL` points to production Postgres
- [ ] `NEXT_PUBLIC_API_URL` matches Nginx reverse proxy origin
- [ ] Cloudinary keys set (if menu images enabled)
- [ ] Razorpay keys set (if billing enabled)
- [ ] Webhook secrets set (Razorpay/Stripe)
- [ ] Sentry DSN set (optional)

## 3) Database (Postgres)

- [ ] Prisma migrations applied on deployment
- [ ] Seed data applied (plan catalogs / feature limits)
- [ ] Backups enabled (see backup strategy doc)
- [ ] Restore test performed (at least once)

## 4) Redis (cache + queues)

- [ ] Redis reachable from containers
- [ ] Cache TTLs validated
- [ ] Queue worker started (if using BullMQ/worker pattern)

## 5) Nginx reverse proxy + SSL

- [ ] Nginx config routes:
  - [ ] `/api/*` -> api
  - [ ] `/socket.io/*` -> api
  - [ ] `/` -> web
- [ ] SSL enabled for both apex and api subdomain
- [ ] HTTP -> HTTPS redirect enabled

## 6) Monitoring & logging

- [ ] Winston configured for JSON logs (or consistent format)
- [ ] Sentry DSN verified (errors appear)
- [ ] Request logging includes correlationId and no PII
- [ ] Basic alerting configured (Sentry + uptime checks)

## 7) CI/CD

- [ ] GitHub Actions workflow exists and passes
- [ ] Automated steps run:
  - [ ] lint
  - [ ] build
  - [ ] docker build
  - [ ] (optional) smoke tests
- [ ] Deployment step uses least-privilege secrets

## 8) Smoke tests (post-deploy)

- [ ] Login works
- [ ] Dashboard loads
- [ ] Orders realtime works
- [ ] Menu CRUD works including image upload
- [ ] Inventory CRUD works
- [ ] Reservations create + status update works
- [ ] QR ordering flow works on mobile viewport
- [ ] Billing upgrade/downgrade endpoints work
- [ ] Webhooks process successfully (verify with Razorpay test mode)

## 9) Performance / security checks

- [ ] Rate limiting enabled (if used)
- [ ] Helmet enabled
- [ ] CORS configured correctly
- [ ] Socket.IO secure settings enabled (origins)
- [ ] gzip/brotli enabled (optional)
- [ ] Response headers validated
