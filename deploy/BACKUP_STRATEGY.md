# A3 Resto — Database Backup Strategy (PostgreSQL)

## Goals

- Protect against accidental deletes / corrupt migrations
- Enable point-in-time recovery where possible
- Keep backups verifiable via restore tests

## Recommended (managed Postgres)

If you use a managed provider (AWS RDS, Supabase, etc.):

- Enable automated backups + PITR (point-in-time recovery)
- Set retention policy (e.g., 7–35 days)

## Self-hosted Postgres (Docker)

For the current setup (Postgres container + volume):

### Daily full backups (pg_dump)

Create a scheduled job (cron or GitHub Actions runner) to run:

- `pg_dump --format=custom --no-owner --no-acl`
- upload to object storage (S3-compatible)

Retention example:

- keep last 14 daily backups
- keep last 8 weekly backups

### Point-in-time recovery (optional/advanced)

To enable PITR:

- enable WAL archiving
- keep WAL segments + base backups

This is more complex but best for production.

## Restore testing (must-do)

Every quarter (or monthly in early stages):

1. Restore to a staging server
2. Run Prisma migrations check
3. Smoke test key flows (login, menu CRUD, order creation)

## How to implement (example container command)

Run a backup from a host with docker access:

```bash
docker exec -t <postgres_container_name> \
  pg_dump -U a3_resto -d a3_resto \
  --format=custom --no-owner --no-acl > backups/a3_resto_$(date +%F).dump
```

Then upload the `.dump` file to storage.

## Security

- Encrypt backups at rest
- Restrict access to backup bucket
- Rotate DB credentials regularly
