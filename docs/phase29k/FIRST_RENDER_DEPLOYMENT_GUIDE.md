# Phase 29K — First Render Deployment Guide

This guide details steps to deploy AK Business OS staging instances to Render.

---

## 1. Managed Databases Setup

1. **Supabase Postgres**:
   - Provision a PostgreSQL database.
   - Obtain database URL (`postgresql://postgres:[password]@db.supabase.co:5432/postgres?sslmode=require`).
2. **Upstash Redis**:
   - Create a Redis DB (Enable TLS support).
   - Retrieve connection host, port, and password.

---

## 2. API Web Service Deployment

1. Create a new **Web Service** on Render.
2. Select repository, path to subproject: `apps/api`.
3. Select **Docker** environment.
4. Add environment variables:
   - `NODE_ENV = staging`
   - `RUN_MODE = api`
   - `DATABASE_URL` (direct direct_url connection)
   - `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
   - `JWT_SECRET`, `SAAS_MASTER_ENCRYPTION_KEY`, `SAAS_BLIND_INDEX_KEY`
5. Configure health probe to `/api/v1/health/ready`.

---

## 3. Worker Service Deployment

1. Create a **Background Worker** service on Render.
2. Select Docker environment. Build context: `./apps/api`.
3. Add identical environment variables except:
   - `RUN_MODE = worker`
4. Set startup command: `node dist/main.js`.

---

## 4. Web Service Deployment

1. Create a **Web Service** on Render. Build context: `./apps/web`.
2. Add environment variables:
   - `NEXT_PUBLIC_API_URL = [Render API Service URL]`
3. Health check probe: `/`.
