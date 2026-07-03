# A3 RESTO — PHASE 2 IMPLEMENTATION CHECKLIST

## PRE-IMPLEMENTATION (This Week)

### Documentation Review
- [ ] Read `ENTERPRISE_IMPLEMENTATION_ROADMAP.md` (overview)
- [ ] Read `ENTERPRISE_STRATEGIC_SUMMARY.md` (strategy & ROI)
- [ ] Read `PHASE_2_QUICK_START.md` (week-by-week guide)
- [ ] Team alignment meeting (30 min)

### Environment Setup
- [ ] Clone latest codebase
- [ ] Install Docker Desktop
- [ ] Generate JWT secret: `openssl rand -base64 32`
- [ ] Create `.env` from `.env.example`
- [ ] Verify all existing services run: `docker-compose up`

---

## WEEK 1: REDIS INTEGRATION & CACHING

### 1.1 Docker Redis Service
- [ ] Add Redis service to `docker-compose.yml`
- [ ] Test Redis connection: `docker-compose exec redis redis-cli PING`
- [ ] Verify Redis persistence volume created
- [ ] Document Redis connection string in runbook

### 1.2 Backend Dependencies
- [ ] Run: `npm install @nestjs/cache-manager cache-manager cache-manager-redis-store redis @socket.io/redis-adapter`
- [ ] Verify packages in `package-lock.json`

### 1.3 Cache Module Integration
- [ ] ✅ Review `apps/api/src/cache/cache.module.ts` (file created)
- [ ] Import CacheConfigModule in `AppModule`
- [ ] Test Redis connection on app startup
- [ ] Verify logs: "Connected to Redis at localhost:6379"

### 1.4 Cache Service
- [ ] ✅ Review `apps/api/src/cache/cache.service.ts` (file created)
- [ ] Export CacheService from AppModule
- [ ] Add CacheService to all services that need caching
- [ ] Test `cache.get()` and `cache.set()` methods

### 1.5 Cache Interceptor
- [ ] ✅ Review `apps/api/src/cache/cache.interceptor.ts` (file created)
- [ ] Add `@UseInterceptors(CacheInterceptor)` to RestaurantsController
- [ ] Add to MenuController, InventoryController
- [ ] Test endpoint twice - second call should be instant (cached)
- [ ] Verify cache keys in Redis: `docker-compose exec redis redis-cli KEYS '*'`

### 1.6 Socket.IO Redis Adapter
- [ ] Update `OrdersGateway` with Redis adapter setup
- [ ] Test WebSocket connection with multiple clients
- [ ] Verify messages broadcast across connections
- [ ] Load test: 100 concurrent WebSocket connections
- [ ] Document Socket.IO clustering setup

### 1.7 Testing & Validation
- [ ] **Unit tests**: Cache service methods
- [ ] **Integration tests**: Cache interceptor
- [ ] **Load test**: Verify cache hit ratio >80%
- [ ] **Benchmark**: Compare response times before/after
- [ ] Expected: 4x faster GET requests

### Week 1 Deliverable
- [ ] Redis running in Docker
- [ ] Caching on all GET endpoints
- [ ] Socket.IO clustering ready
- [ ] Performance baseline established
- [ ] Team trained on cache invalidation patterns

---

## WEEK 2: BULLMQ QUEUE SYSTEM

### 2.1 Queue Module Setup
- [ ] Run: `npm install @nestjs/bull bull`
- [ ] ✅ Review `apps/api/src/queue/queue.module.ts` (file created)
- [ ] Import QueueModule in AppModule
- [ ] Verify queue connections in logs

### 2.2 Email Queue Processor
- [ ] Create `apps/api/src/queue/processors/email.processor.ts`
- [ ] Implement `@Processor('email')` with job handlers
- [ ] Add retry logic (3 attempts, exponential backoff)
- [ ] Setup job failure handlers
- [ ] Document email processor architecture

### 2.3 Order Service Integration
- [ ] Update `OrdersService` to use email queue
- [ ] On order creation: `await this.emailQueue.add('send-confirmation', {...})`
- [ ] Remove synchronous email sending
- [ ] Test: Create order → verify email job enqueued

### 2.4 SMS Queue Processor
- [ ] Create `apps/api/src/queue/processors/sms.processor.ts`
- [ ] Implement SMS job handlers (placeholder for Phase 3)
- [ ] Setup retry logic similar to email
- [ ] Document SMS processor

### 2.5 Scheduled Jobs
- [ ] Install: `npm install @nestjs/schedule`
- [ ] Create `apps/api/src/queue/scheduled-jobs.ts`
- [ ] Implement daily report generation (2 AM UTC)
- [ ] Implement weekly forecasts (3 AM Sunday UTC)
- [ ] Implement monthly cleanup (1st at 4 AM UTC)

### 2.6 Bull Board (Queue UI)
- [ ] Install: `npm install @bull-board/api @bull-board/express`
- [ ] Setup Bull Board UI at `GET /bull/queues`
- [ ] Document queue monitoring
- [ ] Create runbook for queue management

### 2.7 Testing & Validation
- [ ] **Unit tests**: Each processor
- [ ] **Integration tests**: Queue-to-processor flow
- [ ] **Load test**: 1000 jobs queued → all processed
- [ ] **Reliability**: Verify job retry on failure
- [ ] Expected throughput: 10,000 jobs/hour

### Week 2 Deliverable
- [ ] BullMQ fully configured
- [ ] Email queue operational
- [ ] Scheduled jobs working
- [ ] Bull Board UI accessible
- [ ] Queue documentation complete

---

## WEEK 3: ENVIRONMENT & SECRETS MANAGEMENT

### 3.1 Environment Variables
- [ ] ✅ Review `.env.example` (file created)
- [ ] Copy to `.env` and `.env.production`
- [ ] Generate and set JWT_SECRET in `.env`
- [ ] Set DATABASE_URL, REDIS_URL
- [ ] Create `.gitignore` entry for `.env`

### 3.2 Dependencies
- [ ] Run: `npm install @nestjs/config class-validator class-transformer joi`

### 3.3 Environment Validation
- [ ] ✅ Review `apps/api/src/config/env-validation.module.ts` (file created)
- [ ] Import EnvConfigModule in AppModule (FIRST import)
- [ ] Test app startup with missing env vars (should fail gracefully)
- [ ] Verify all required vars documented

### 3.4 JWT Strategy Update
- [ ] Update `apps/api/src/auth/jwt.strategy.ts` to use ConfigService
- [ ] Change from hardcoded 'super-secret' to `configService.get('JWT_SECRET')`
- [ ] Test JWT generation and validation
- [ ] Verify expired tokens rejected

### 3.5 Other Service Configuration
- [ ] Update Prisma connection (use DATABASE_URL)
- [ ] Update Redis connection (use REDIS_URL)
- [ ] Setup environment per environment (dev/test/prod)
- [ ] Document all env vars in runbook

### 3.6 Secrets Management Strategy
- [ ] Setup secrets rotation schedule (quarterly)
- [ ] Document secret generation process
- [ ] Setup AWS Secrets Manager (production)
- [ ] Create backup of JWT_SECRET in secure location

### 3.7 Testing & Validation
- [ ] Test app starts with valid `.env`
- [ ] Test app fails to start with invalid`.env`
- [ ] Verify no secrets logged in console
- [ ] Audit logs for secret access

### Week 3 Deliverable
- [ ] All environment variables externalized
- [ ] No hardcoded secrets in code
- [ ] Configuration validation working
- [ ] Production-grade secrets management
- [ ] Runbook documented

---

## WEEK 4: AUDIT LOGGING & MONITORING

### 4.1 Prisma Schema Updates
- [ ] Update `apps/api/prisma/schema.prisma`
- [ ] Add `AuditLog` model (see roadmap)
- [ ] Add `DataRetention` model
- [ ] Update User model to include `auditLogs` relation
- [ ] Update Restaurant model to include `auditLogs` & `dataRetention`

### 4.2 Database Migration
- [ ] Run: `npx prisma migrate dev --name add_audit_logging`
- [ ] Verify migration created in `prisma/migrations/`
- [ ] Test migration on local database
- [ ] Verify AuditLog table created with correct indexes

### 4.3 Audit Module
- [ ] ✅ Review `apps/api/src/audit/audit.module.ts` (file created)
- [ ] Export AuditService from module
- [ ] Test audit logging methods
- [ ] Implement comprehensive logging

### 4.4 Audit Interceptor
- [ ] Create `apps/api/src/audit/audit.interceptor.ts`
- [ ] Add to global interceptors in `main.ts`
- [ ] Test: Create/update/delete entity → audit log created
- [ ] Verify old/new values captured
- [ ] Verify user ID and IP address recorded

### 4.5 Audit Endpoints
- [ ] `GET /audit-logs?entity=Order&entityId=123` - View history
- [ ] `GET /audit-logs?restaurantId=X&dateRange=90d` - Date range
- [ ] `GET /audit-logs/export` - Download CSV
- [ ] Implement pagination and filtering

### 4.6 Data Retention Policy
- [ ] Implement automatic cleanup of old logs (6-month retention)
- [ ] Add to scheduled jobs: `@Cron('0 4 1 * *')` (1st of month at 4 AM)
- [ ] Test cleanup: verify old logs deleted
- [ ] Document retention policy

### 4.7 Sentry Error Monitoring
- [ ] ✅ Review `apps/api/src/monitoring/sentry.service.ts` (file created)
- [ ] Run: `npm install @sentry/node @sentry/cli`
- [ ] Create Sentry project (free tier)
- [ ] Get SENTRY_DSN from Sentry
- [ ] Add to `.env` and `.env.example`

### 4.8 Sentry Integration
- [ ] Update `apps/api/src/main.ts` with Sentry middleware
- [ ] Initialize SentryService on app startup
- [ ] Test: Trigger error → appears in Sentry dashboard
- [ ] Setup Sentry alerts (Slack channel)
- [ ] Configure error grouping rules

### 4.9 Testing & Validation
- [ ] **Audit tests**: Verify all mutations logged
- [ ] **Retention tests**: Verify cleanup works
- [ ] **Sentry tests**: Trigger errors, verify reporting
- [ ] **Performance**: Audit logging adds <5ms latency
- [ ] **Compliance**: Audit trail complete for all entities

### Week 4 Deliverable
- [ ] Audit logging fully implemented
- [ ] Data retention policies in place
- [ ] Sentry error monitoring active
- [ ] Compliance reporting ready
- [ ] Documentation complete

---

## PHASE 2 COMPLETION CHECKLIST

### Code Quality
- [ ] All new code has unit tests
- [ ] All new services have integration tests
- [ ] No console.log() statements (use logger)
- [ ] No hardcoded values (use config)
- [ ] ESLint passes: `npm run lint`
- [ ] TypeScript strict mode: `npm run build`

### Documentation
- [ ] README updated with new features
- [ ] API documentation updated
- [ ] Environment variables documented
- [ ] Runbook created for operations
- [ ] Architecture diagrams updated

### Deployment
- [ ] Docker image builds: `docker build -t a3-resto-api .`
- [ ] Docker Compose works: `docker-compose up`
- [ ] All services pass health checks
- [ ] Logs are clean (no warnings)

### Performance
- [ ] Baseline metrics captured (before/after)
- [ ] API response times: <100ms (GET), <200ms (POST)
- [ ] WebSocket latency: <50ms
- [ ] Database queries optimized
- [ ] Memory usage: <500MB

### Security
- [ ] No secrets in code (audit with `git grep`)
- [ ] No SQL injection vulnerabilities
- [ ] CORS properly configured
- [ ] Rate limiting on auth endpoints
- [ ] HTTPS/TLS ready (Nginx config)

### Monitoring & Observability
- [ ] Sentry captures all errors
- [ ] Logs aggregated centrally
- [ ] Health endpoint: `GET /health`
- [ ] Metrics collection ready
- [ ] Alerts configured

### Team Handoff
- [ ] Team trained on new infrastructure
- [ ] Operations runbook complete
- [ ] On-call procedures documented
- [ ] Troubleshooting guide created
- [ ] Post-launch support plan

---

## PHASE 2 SUCCESS CRITERIA

### Infrastructure
- ✅ Redis running with persistence
- ✅ BullMQ processing 10,000+ jobs/hour
- ✅ All secrets managed via environment
- ✅ Audit trail 100% coverage
- ✅ Error monitoring 100% capture rate

### Performance
- ✅ 4x improvement in GET request speed
- ✅ <50ms WebSocket latency
- ✅ Database queries optimized
- ✅ Memory efficient (no leaks)
- ✅ Horizontal scaling ready

### Reliability
- ✅ Job queue retry mechanisms working
- ✅ Database backups automated
- ✅ Error recovery procedures tested
- ✅ Graceful degradation on service failures
- ✅ 99%+ uptime in testing

### Compliance
- ✅ Audit trail captured
- ✅ Data retention policies enforced
- ✅ User tracking logged
- ✅ PII handled securely
- ✅ Compliance reporting available

### Documentation
- ✅ All features documented
- ✅ Runbook created
- ✅ API documentation updated
- ✅ Architecture diagrams current
- ✅ Team trained

---

## PHASE 2 SIGN-OFF

```
Infrastructure Foundation Complete ✅

Redis Caching:           [████████████] 100%
BullMQ Queues:           [████████████] 100%
Environment Management:  [████████████] 100%
Audit Logging:           [████████████] 100%
Error Monitoring:        [████████████] 100%

Overall Status: READY FOR PHASE 3

Phase 3 Start Date: _______________
Approved By: _____________________
Date: ____________________________
```

---

## NEXT PHASE PREPARATION

### Phase 3 Preview (Week 5)
- Email system integration (SendGrid)
- SMS notifications (Twilio)
- Push notifications
- **Start:** June 24, 2026

### Phase 3 Dependencies (Install Now)
```bash
npm install @sendgrid/mail nodemailer twilio
npm install @nestjs/mailer handlebars
```

### Phase 3 Preparation Tasks
- [ ] Create SendGrid account (free tier)
- [ ] Create Twilio account (free trial)
- [ ] Get API keys
- [ ] Add to `.env.example`
- [ ] Create email templates directory

---

## SUPPORT & ESCALATION

### Questions During Implementation?
1. Check `PHASE_2_QUICK_START.md` troubleshooting section
2. Review created files documentation
3. Team sync meeting (async Slack channel)
4. Post in project GitHub Discussions

### Blockers or Issues?
1. Document the issue clearly
2. Include error logs
3. Include reproduction steps
4. Create GitHub issue with label `phase-2`
5. Team will respond within 24 hours

### Success Celebration 🎉
- [ ] Team demo of Phase 2 features
- [ ] Update stakeholders
- [ ] Blog post: "A3 Resto Goes Enterprise"
- [ ] Customer communication: "New reliability features"

---

**Phase 2 Start Date**: June 3, 2026
**Phase 2 End Date**: June 28, 2026
**Status**: 🟢 READY FOR IMPLEMENTATION
**Contact**: [Your Team Slack Channel]
