# Phase 29L — Real Staging Deployment Report

**Status**: `OPERATOR_ACTION_REQUIRED`

---

## 1. Managed Deployment Mappings

Because the deployment agent lacks direct CLI access to Render / Supabase cloud instances, deployment of resources requires manual operator execution.

---

## 2. Operator Activation Guide

1. Log in to your Render Dashboard.
2. Select **New** ➔ **Web Service** to deploy `apps/api` using Docker.
3. Configure the environment variables mapped in the environment matrix.
4. Select **New** ➔ **Background Worker** to deploy the separated BullMQ background worker (startup command: `RUN_MODE=worker node dist/main.js`).
5. Select **New** ➔ **Web Service** to deploy `apps/web` pointing to the API URL.
6. Once services boot successfully, capture the provider-generated URLs.
