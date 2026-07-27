#!/bin/bash
# monitor_disk.sh
# Production storage and logs monitoring script for Business OS

THRESHOLD=80
ALERT_EMAIL="admin@yourdomain.com"
DB_NAME="a3resto"
DB_USER="postgres"

# 1. System Disk Usage Check
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

if [ "$DISK_USAGE" -gt "$THRESHOLD" ]; then
    echo "ALERT: Host root disk usage has exceeded safety threshold: ${DISK_USAGE}%" | mail -s "Disk Space Alert - Business OS" $ALERT_EMAIL
fi

# 2. PostgreSQL Storage Check & Audit Logs Row Count
if command -v docker >/dev/null 2>&1; then
    DB_SIZE=$(docker exec -t a3-resto-saas-postgres-1 psql -U $DB_USER -d $DB_NAME -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" | xargs)
    AUDIT_ROW_COUNT=$(docker exec -t a3-resto-saas-postgres-1 psql -U $DB_USER -d $DB_NAME -t -c "SELECT count(*) FROM audit_logs;" | xargs)
else
    DB_SIZE=$(psql -U $DB_USER -d $DB_NAME -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" | xargs)
    AUDIT_ROW_COUNT=$(psql -U $DB_USER -d $DB_NAME -t -c "SELECT count(*) FROM audit_logs;" | xargs)
fi

# 3. Log results locally for audits
echo "[$(date)] Disk Usage: ${DISK_USAGE}%, DB Size: ${DB_SIZE}, Audit Table Rows: ${AUDIT_ROW_COUNT}" >> /var/log/business-os-monitor.log
