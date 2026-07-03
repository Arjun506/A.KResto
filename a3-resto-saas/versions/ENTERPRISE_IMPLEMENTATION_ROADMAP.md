# A3 RESTO — ENTERPRISE SCALING IMPLEMENTATION ROADMAP

**Status**: Phase 1 Complete → Phase 2 (Enterprise) Ready
**Date**: June 2026
**Architecture**: NestJS + React + PostgreSQL + Socket.IO
**Scale Target**: 1000+ concurrent users per restaurant

---

## EXECUTIVE SUMMARY

This roadmap transforms A3 Resto from a functional multi-tenant restaurant ERP into a **scalable, AI-powered enterprise SaaS platform** with production-grade monitoring, analytics, and automation.

**Key Deliverables**:
- 12 major enterprise modules
- 5-phase implementation schedule (3-4 weeks each)
- Redis-backed caching and queues
- OpenAI-powered insights and automation
- Real-time analytics dashboards
- Kubernetes-ready infrastructure
- Production security & monitoring

---

## PHASE 2: INFRASTRUCTURE & FOUNDATION (Week 1-4)

### 2.1 Redis Integration & Caching
**Purpose**: Scale WebSocket connections, cache frequently accessed data, session management

**Components**:
```
Infrastructure:
├── Redis Docker service (6379)
├── Redis client configuration
├── Cache key strategy
├── Session store migration
└── Socket.IO adapter for clustering
```

**Implementation Tasks**:

1. **Add Redis to Docker Compose**
```docker
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  command: redis-server --appendonly yes
```

2. **Backend Setup** (apps/api)
   - Install: `@nestjs/cache-manager`, `cache-manager`, `cache-manager-redis-store`, `redis`, `@socket.io/redis-adapter`
   - Create `CacheModule` with provider configuration
   - Implement cache interceptor for GET endpoints
   - Setup Redis connection pool with retry logic

3. **Cache Strategy**
   - **TTL by entity**:
     - Restaurants: 1 hour (rarely change)
     - Menu items: 30 minutes
     - User sessions: 24 hours
     - Inventory: 5 minutes (real-time sensitive)
   - **Invalidation on mutation** (POST/PUT/DELETE)
   - **Cache warming** on app startup

4. **Session Management**
   - Move from localStorage to Redis server-side sessions
   - Implement session tokens with expiration
   - Secure session cookies (httpOnly, secure)

5. **Socket.IO Clustering**
   - Install Socket.IO Redis adapter
   - Enable horizontal scaling (multiple API instances)
   - Session affinity for real-time connections

**Files to Create**:
- `apps/api/src/cache/cache.module.ts`
- `apps/api/src/cache/cache.config.ts`
- `apps/api/src/cache/cache.interceptor.ts`
- `apps/api/src/session/session.module.ts`

**Dependencies**:
```json
{
  "@nestjs/cache-manager": "^2.1.0",
  "cache-manager": "^5.3.1",
  "cache-manager-redis-store": "^3.0.0",
  "redis": "^4.6.0",
  "@socket.io/redis-adapter": "^8.2.0"
}
```

---

### 2.2 Queue System (BullMQ)
**Purpose**: Async job processing, background tasks, email/SMS queues

**Components**:
```
Queues:
├── Email Queue (transactional, billing, alerts)
├── SMS Queue (OTP, notifications)
├── PDF Export Queue (reports, invoices)
├── Image Processing Queue (resizing, optimization)
├── Analytics Queue (data aggregation)
└── Notification Queue (push notifications)
```

**Implementation Tasks**:

1. **Add BullMQ to Backend**
   - Install: `@nestjs/bull`, `bull`, `@types/bull`
   - Create `QueueModule` with BullBoard for monitoring UI

2. **Queue Implementations**
   ```typescript
   // Example: Email Queue
   @Processor('email')
   export class EmailProcessor {
     @Process('send-confirmation')
     async sendConfirmation(job: Job<EmailPayload>) {
       // Send transactional email via SendGrid
     }
   }
   ```

3. **Producer Endpoints**
   - Order confirmation → enqueue email
   - Reservation created → enqueue email + SMS
   - Daily report → enqueue PDF export
   - Inventory low → enqueue alert

4. **Job Scheduling**
   - Daily sales reports at 2 AM
   - Weekly inventory forecasts
   - Monthly billing/invoices
   - Cleanup: delete old data (6-month retention)

**Files to Create**:
- `apps/api/src/queue/queue.module.ts`
- `apps/api/src/queue/processors/email.processor.ts`
- `apps/api/src/queue/processors/sms.processor.ts`
- `apps/api/src/queue/processors/report.processor.ts`

**Dependencies**:
```json
{
  "@nestjs/bull": "^10.0.1",
  "bull": "^4.11.4",
  "@bull-board/api": "^5.0.0",
  "@bull-board/express": "^5.0.0"
}
```

---

### 2.3 Environment & Secrets Management
**Purpose**: Security hardening, configuration management

**Implementation Tasks**:

1. **JWT Security**
   - Move `'super-secret'` → `JWT_SECRET` env var
   - Generate secure 256-bit random secret: `openssl rand -base64 32`
   - Rotate secret monthly (maintain versioning)

2. **Create `.env.example`** for all deployments
   ```
   # Backend
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=postgresql://user:pass@postgres:5432/a3_resto
   JWT_SECRET=<generated-secret>
   JWT_EXPIRATION=24h
   
   # Redis
   REDIS_URL=redis://redis:6379
   
   # Email
   SENDGRID_API_KEY=
   SENDER_EMAIL=noreply@a3resto.com
   
   # SMS
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_PHONE_NUMBER=
   
   # OpenAI
   OPENAI_API_KEY=
   
   # Stripe
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   
   # Frontend
   NEXT_PUBLIC_API_URL=https://api.a3resto.com
   ```

3. **Implement ConfigModule**
   - NestJS `@nestjs/config` with validation
   - Schema validation using `class-validator`
   - Separate configs per environment

**Files to Create**:
- `.env.example`
- `.env.production`
- `apps/api/src/config/configuration.ts`
- `apps/api/src/config/env.validation.ts`

---

### 2.4 Audit Logging & Compliance
**Purpose**: Track all data mutations for compliance, security, auditing

**Prisma Schema Additions**:
```prisma
model AuditLog {
  id            String    @id @default(cuid())
  restaurantId  String
  userId        String?
  entity        String    // "Order", "User", "Menu", etc.
  entityId      String
  action        String    // "CREATE", "UPDATE", "DELETE"
  oldValues     Json?     // Previous state
  newValues     Json?     // New state
  changes       String[]  // Changed fields
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime  @default(now())
  
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  user          User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([restaurantId])
  @@index([createdAt])
  @@index([entity, entityId])
}

model DataRetention {
  id           String   @id @default(cuid())
  restaurantId String   @unique
  retentionDays Int    @default(180)  // 6 months
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
}
```

**Implementation Tasks**:

1. **Create AuditModule**
   - Interceptor to capture mutations
   - Store user ID, IP, action, old/new values
   - Auto-cleanup old logs based on retention

2. **Audit Endpoints**
   - `GET /audit-logs?entity=Order&entityId=123` - View history
   - `GET /audit-logs?restaurantId=X&dateRange=90d` - Generate report
   - `GET /audit-logs/export` - Download CSV

**Files to Create**:
- `apps/api/src/audit/audit.module.ts`
- `apps/api/src/audit/audit.service.ts`
- `apps/api/src/audit/audit.interceptor.ts`

---

## PHASE 3: NOTIFICATIONS & COMMUNICATIONS (Week 5-8)

### 3.1 Email System Integration
**Purpose**: Transactional emails, billing notices, alerts

**Services**:
- SendGrid for bulk emails
- Nodemailer for fallback/SMTP

**Email Templates**:
```
1. Order Confirmation
   - Order details, estimated time
   - Customer action: track status link

2. Reservation Confirmation
   - Date, time, party size, special requests
   - Reminder 24h before

3. Reservation No-Show Alert
   - 30 min after reservation time
   - Auto-trigger cancellation + credit

4. Invoice/Billing
   - Monthly subscription invoice
   - Payment method on file
   - Renewal date

5. Inventory Alert
   - Low stock warning
   - Reorder recommendations
   - Supplier contact info

6. Daily Report
   - Sales summary, top items
   - Customer insights, reservation stats
   - One-click analytics link

7. Promotional
   - Special offers to loyalty customers
   - Weekend specials
   - New menu items
```

**Implementation Tasks**:

1. **Add to Dependencies**
```json
{
  "@sendgrid/mail": "^7.7.0",
  "nodemailer": "^6.9.7",
  "@nestjs-modules/mailer": "^1.11.2",
  "handlebars": "^4.7.7"
}
```

2. **Create EmailModule** (apps/api/src/email/)
   ```
   ├── email.module.ts
   ├── email.service.ts
   ├── email.processor.ts (BullMQ processor)
   └── templates/
       ├── order-confirmation.hbs
       ├── reservation-confirmation.hbs
       ├── invoice.hbs
       ├── low-inventory.hbs
       └── daily-report.hbs
   ```

3. **Email Service Interface**
   ```typescript
   sendOrderConfirmation(order: Order): Promise<void>
   sendReservationConfirmation(reservation: Reservation): Promise<void>
   sendInvoice(subscription: Subscription): Promise<void>
   sendLowInventoryAlert(restaurant: Restaurant, items: InventoryItem[]): Promise<void>
   sendDailyReport(restaurant: Restaurant, data: DailyStats): Promise<void>
   ```

4. **Integrate with Existing Services**
   - OrdersService: emit 'order.confirmed' → enqueue email
   - ReservationsService: emit 'reservation.confirmed' → enqueue email
   - SubscriptionsService: emit 'invoice.generated' → enqueue email

---

### 3.2 SMS Notifications (Twilio)
**Purpose**: OTP, order alerts, reservation reminders

**SMS Types**:
```
1. OTP Verification (2FA)
2. Order Status Updates
   - "Order #123 accepted, ~30 min wait"
   - "Order #123 ready for pickup!"
3. Reservation Reminders
   - 24h before: "Your reservation at 7 PM tomorrow"
   - 30m before: "Your table is ready!"
4. Alerts
   - "Inventory low: salmon - 5 units left"
   - "Payment failed on subscription"
```

**Implementation Tasks**:

1. **Add to Dependencies**
```json
{
  "twilio": "^4.0.0"
}
```

2. **Create SMSModule** (apps/api/src/sms/)
   ```
   ├── sms.module.ts
   ├── sms.service.ts
   ├── sms.processor.ts (BullMQ)
   └── templates.ts
   ```

3. **SMS Service**
   ```typescript
   sendOTP(phoneNumber: string, code: string): Promise<void>
   sendOrderUpdate(phoneNumber: string, order: Order): Promise<void>
   sendReservationReminder(phoneNumber: string, reservation: Reservation): Promise<void>
   ```

4. **Opt-in Management**
   - User preferences: enable/disable SMS notifications
   - Add `smsEnabled` flag to User model

**Files to Create**:
- `apps/api/src/sms/sms.module.ts`
- `apps/api/src/sms/sms.service.ts`

---

### 3.3 Push Notifications
**Purpose**: In-app alerts, reminders, promotions

**Services**:
- Firebase Cloud Messaging (FCM) for mobile/web
- Browser push API for desktop

**Notifications**:
```
1. Order Status (real-time via Socket.IO already)
2. Reservation 30m reminder
3. Special promotions
4. New menu items
5. System maintenance alerts
```

**Implementation**: Future phase (v2.5) - foundational work in Phase 3

---

## PHASE 4: AI INTEGRATION & ANALYTICS (Week 9-12)

### 4.1 OpenAI Integration
**Purpose**: AI chatbot, insights, recommendations, smart reporting

**Features**:

#### 4.1.1 AI Chatbot Assistant
- **Use Cases**:
  - Customer: make reservation, check order status, menu questions
  - Restaurant staff: inventory lookup, sales questions, workflow help
  - Admin: business metrics, alerts, trend analysis

- **Implementation**:
  ```typescript
  // NestJS service
  async getAIResponse(query: string, context: ChatContext): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);
    const response = await this.openaiService.chat({
      system: systemPrompt,
      messages: context.history,
      model: "gpt-4-turbo"
    });
    return response;
  }
  ```

#### 4.1.2 Restaurant Insights
- **What's Generated**:
  - Daily summary: sales, orders, reservations
  - Peak hours analysis
  - Top-selling items
  - Customer trends
  - Staff performance metrics

- **Prompt Example**:
  ```
  "Summarize yesterday's operations for RestaurantX:
   - Total revenue: $5,200
   - Orders: 120 (avg $43.33)
   - Reservations: 45 (90% show rate)
   - Top item: Burger (35 sold)
   - Peak hour: 7-8 PM (45 orders)
   
   Provide 3 actionable insights in 150 words."
  ```

#### 4.1.3 Smart Recommendations
- **Inventory**: "Based on sales patterns, order 50 lbs salmon this week (95% confidence)"
- **Menu Optimization**: "Pasta sales down 20% YoY - consider reformulation"
- **Staffing**: "Expect 150+ orders next Saturday - add 2 kitchen staff"
- **Pricing**: "Desserts underperforming - test 10% discount on weekdays"

#### 4.1.4 AI Report Generation
- Weekly business summaries
- Competitor benchmarking (if data available)
- Customer satisfaction analysis
- Trend predictions

**Implementation Tasks**:

1. **Add to Dependencies**
```json
{
  "openai": "^4.31.0"
}
```

2. **Create AIModule** (apps/api/src/ai/)
   ```
   ├── ai.module.ts
   ├── openai.service.ts
   ├── ai-chat.controller.ts
   ├── ai-insights.service.ts
   ├── ai-recommendations.service.ts
   └── prompts/
       ├── system.prompt.ts
       ├── insights.prompt.ts
       └── recommendations.prompt.ts
   ```

3. **API Endpoints**
   ```
   POST /api/ai/chat
     - body: { message: string, history?: Message[] }
     - response: { reply: string, metadata: {...} }
   
   GET /api/restaurants/:id/ai-insights
     - response: { summary: string, topItems, trends }
   
   GET /api/restaurants/:id/ai-recommendations
     - response: { inventory, menu, staffing, pricing }
   ```

4. **Rate Limiting**
   - Free tier: 5 requests/hour
   - Pro tier: 50 requests/hour
   - Rate limit via Redis

5. **Cost Management**
   - Track token usage per restaurant
   - Implement soft limits ($50/month default)
   - Cache common queries (e.g., daily summary)

**Files to Create**:
- `apps/api/src/ai/openai.service.ts`
- `apps/api/src/ai/ai-insights.service.ts`
- `apps/api/src/ai/ai-chat.controller.ts`

---

### 4.2 Advanced Analytics Module
**Purpose**: Predictive analytics, forecasting, business intelligence

**Analytics Components**:

#### 4.2.1 Sales Forecasting
- Predict revenue for next 7/30/90 days
- Seasonal adjustment (holidays, weekends)
- Confidence intervals

#### 4.2.2 Inventory Prediction
- Forecast ingredient consumption
- Optimal reorder points
- Expiration date warnings

#### 4.2.3 Customer Trend Analysis
- Churn prediction (customers not returning)
- Lifetime value estimation
- Cohort analysis (acquisition date grouping)

#### 4.2.4 Peak Hour Prediction
- Predict busy times by day/weather/events
- Staffing recommendations
- Table turnover optimization

**Implementation**:
- Use TensorFlow.js for frontend predictions (lite models)
- OpenAI for intelligent summarization
- Historical data aggregation via BullMQ

**Prisma Schema Additions**:
```prisma
model Analytics {
  id           String   @id @default(cuid())
  restaurantId String
  date         DateTime
  
  // Sales
  totalRevenue     Float
  orderCount       Int
  avgOrderValue    Float
  ordersByHour     Json  // { "12": 45, "13": 52, ... }
  
  // Reservations
  reservationCount Int
  noShowCount      Int
  avgPartySize     Float
  
  // Inventory
  itemsSold        Int
  wastePercentage  Float
  
  // Customers
  uniqueCustomers  Int
  returningCustomers Int
  
  createdAt DateTime @default(now())
  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  
  @@index([restaurantId, date])
}

model Forecast {
  id           String   @id @default(cuid())
  restaurantId String
  type         String   // "SALES", "INVENTORY", "CUSTOMERS"
  forecastDate DateTime
  
  prediction   Float
  confidence   Float    // 0-100
  notes        String?
  
  createdAt DateTime @default(now())
  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  
  @@index([restaurantId, type, forecastDate])
}
```

**Files to Create**:
- `apps/api/src/analytics/analytics.module.ts`
- `apps/api/src/analytics/analytics.service.ts`
- `apps/api/src/analytics/forecast.service.ts`
- `apps/api/src/analytics/analytics.processor.ts` (BullMQ)

---

### 4.3 Real-Time Analytics Dashboard
**Purpose**: Live business metrics, interactive visualizations

**Frontend Dashboard Pages** (apps/web/app/dashboard/):
```
├── overview/          # Key metrics cards
├── sales/             # Revenue charts, trends
├── orders/            # Order volume, status breakdown
├── inventory/         # Stock levels, predictions
├── customers/         # Customer trends, segments
├── reservations/      # Occupancy, no-shows
├── analytics/         # Advanced reporting
└── ai-insights/       # AI-generated summaries
```

**Real-Time Metrics** (via Socket.IO):
```typescript
// Backend emits every 1 minute to restaurant room
socket.to(`restaurant:${restaurantId}`).emit('metrics:update', {
  activeOrders: 12,
  totalToday: 45,
  revenueToday: 2150.50,
  avgWaitTime: 15,
  timestamp: Date.now()
});
```

**Frontend Components** (using Recharts):
- Line charts (sales trend)
- Bar charts (hourly orders)
- Pie charts (item popularity)
- Gauge charts (inventory levels)
- Heatmaps (peak hours)

**Files to Create**:
- `apps/web/app/dashboard/analytics/page.tsx`
- `apps/web/components/dashboard/metrics-card.tsx`
- `apps/web/components/dashboard/sales-chart.tsx`
- `apps/web/components/dashboard/forecast-chart.tsx`

---

## PHASE 5: MONITORING & PRODUCTION READINESS (Week 13-16)

### 5.1 Error Monitoring (Sentry)
**Purpose**: Real-time error tracking, alerting, debugging

**Implementation**:

1. **Add to Dependencies**
```json
{
  "@sentry/node": "^7.80.0",
  "@sentry/cli": "^2.26.0"
}
```

2. **Backend Setup** (apps/api)
   ```typescript
   // main.ts
   import * as Sentry from "@sentry/node";
   
   const app = await NestFactory.create(AppModule);
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
     profilesSampleRate: 0.1,
   });
   ```

3. **Error Enrichment**
   - Capture user context (restaurant ID, user ID)
   - Attach breadcrumbs for API calls
   - Custom error severity levels

4. **Frontend Setup** (apps/web)
   ```typescript
   import * as Sentry from "@sentry/nextjs";
   
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

5. **Alerts**
   - Configure Sentry alerts for: errors spike, new error types
   - Slack/Email integration

---

### 5.2 Uptime Monitoring (UptimeRobot)
**Purpose**: Monitor API health, trigger alerts on downtime

**Configuration**:
- Monitor API health endpoint: `GET /health`
- Monitor WebSocket connection: test Socket.IO gateway
- Alert channels: Slack, PagerDuty, Email
- Frequency: Every 5 minutes

**Health Endpoint** (apps/api):
```typescript
@Get('health')
health() {
  return {
    status: 'ok',
    timestamp: new Date(),
    services: {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      openai: 'ok' // static check
    }
  };
}
```

---

### 5.3 Logging & Log Aggregation
**Purpose**: Centralized logging, troubleshooting

**Approach**:
1. **Development**: Console logging via NestJS Logger
2. **Production**: Winston logger → ELK Stack (Elasticsearch, Logstash, Kibana) or CloudWatch

**Implementation**:
```json
{
  "winston": "^3.11.0",
  "winston-elasticsearch": "^0.17.4"
}
```

**Log Levels**:
- ERROR: System failures, exceptions
- WARN: Rate limits, degraded performance
- INFO: API calls, state changes
- DEBUG: Business logic decisions (disabled in production)

---

### 5.4 Performance Optimization

#### Database Query Optimization
- Eager loading with Prisma `include/select`
- Database indexing strategy
- Query caching via Redis
- Connection pooling (PgBouncer)

Example:
```typescript
// Before: N+1 queries
const orders = await prisma.order.findMany();

// After: Single optimized query
const orders = await prisma.order.findMany({
  include: {
    items: {
      include: { menuItem: true }
    },
    table: true
  },
  where: { restaurantId }
});
```

#### WebSocket Scaling
- Socket.IO Redis adapter (completed in Phase 2)
- Horizontal scaling: multiple API instances
- Session affinity via load balancer

#### Frontend Performance
- Image optimization (Next.js Image component)
- Code splitting (lazy loading routes)
- CSS optimization (Tailwind purge)
- Bundle analysis & splitting

**Add to Dependencies**:
```json
{
  "@next/bundle-analyzer": "^14.0.0"
}
```

---

### 5.5 Data Backup & Disaster Recovery

**Strategy**:
1. **Daily PostgreSQL backups** (automated)
   - Full backup at 2 AM UTC
   - 30-day retention
   - Offsite storage (S3/Azure Blob)

2. **Point-in-time recovery** (PITR)
   - WAL archiving enabled
   - Recovery to any 7-day point

3. **Backup testing**
   - Monthly restore drills
   - Restore to staging environment

**Docker Configuration**:
```bash
# Backup script
#!/bin/bash
BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump postgresql://user:pass@postgres:5432/a3_resto > $BACKUP_DIR/a3_resto_$TIMESTAMP.sql
gzip $BACKUP_DIR/a3_resto_$TIMESTAMP.sql
aws s3 cp $BACKUP_DIR/a3_resto_$TIMESTAMP.sql.gz s3://a3-resto-backups/
```

---

### 5.6 Kubernetes Preparation

**K8s Architecture**:
```yaml
Deployments:
├── api (2+ replicas, HPA for autoscaling)
├── web (2+ replicas, HPA)
├── postgres (StatefulSet, persistent volume)
└── redis (StatefulSet, persistent volume)

ConfigMaps:
├── api-config (env vars)
├── nginx-config
└── logging-config

Secrets:
├── database-credentials
├── jwt-secret
├── openai-key
├── stripe-key
└── twilio-credentials

Services:
├── api (ClusterIP)
├── web (ClusterIP)
├── postgres (Headless)
└── redis (Headless)

Ingress:
├── api.a3resto.com/api → api:3001
├── a3resto.com → web:3000
└── admin.a3resto.com → web:3000/admin
```

**Manifests to Create**:
```
deploy/kubernetes/
├── 00-namespace.yaml
├── 01-configmap.yaml
├── 02-secrets.yaml
├── 03-postgres-statefulset.yaml
├── 04-redis-statefulset.yaml
├── 05-api-deployment.yaml
├── 06-web-deployment.yaml
├── 07-services.yaml
├── 08-ingress.yaml
├── 09-hpa.yaml
└── 10-monitoring.yaml
```

---

## PHASE 6: ADVANCED FEATURES (Week 17-20)

### 6.1 Payment Processing (Stripe)
**Purpose**: Subscription billing, invoice generation

**Flow**:
```
1. Customer selects plan → redirect to Stripe checkout
2. Payment successful → webhook → create Subscription
3. Invoice generated → enqueue email
4. Monthly: auto-renew or upgrade/downgrade
```

**Prisma Schema**:
```prisma
model Subscription {
  id               String   @id @default(cuid())
  restaurantId     String   @unique
  stripeCustomerId String   @unique
  stripeSubscriptionId String @unique
  
  planName         String   // "STARTER", "PROFESSIONAL", "ENTERPRISE"
  status           String   // "active", "past_due", "canceled"
  currentPeriodStart DateTime
  currentPeriodEnd DateTime
  canceledAt       DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
}

model Invoice {
  id           String   @id @default(cuid())
  restaurantId String
  subscriptionId String
  
  stripeInvoiceId String @unique
  status       String   // "draft", "open", "paid", "uncollectible", "void"
  
  amount       Float
  currency     String   @default("USD")
  
  issuedAt     DateTime
  dueAt        DateTime?
  paidAt       DateTime?
  
  createdAt DateTime @default(now())
  
  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
}
```

**Implementation Tasks**:
1. Create `BillingModule` with Stripe service
2. Webhook endpoints for payment events
3. Admin dashboard for subscription management
4. Invoice generation and email

---

### 6.2 Data Export & Reporting
**Purpose**: CSV/PDF exports, compliance reporting

**Export Types**:
- Orders report (date range, format: CSV/PDF)
- Sales by item (CSV)
- Customer list (CSV)
- Financial summary (PDF)
- Audit log (CSV)

**Implementation**:
- Use `fast-csv` for CSV generation
- Use `puppeteer` for PDF generation
- Enqueue export jobs (can be large)
- Email link to download (expires in 24h)

---

### 6.3 Multi-Language & Localization
**Purpose**: Support restaurants in different countries

**Locales**: EN, ES, FR, DE, IT, PT, ZH

**Implementation**:
- i18n library (next-i18next)
- Backend enum translations
- Currency formatting by locale

---

### 6.4 Advanced Permissions (ACL)
**Purpose**: Granular role-based permissions

**Current**: Basic roles (ADMIN, MANAGER, WAITER, etc.)
**Advanced**: Permission matrix per role
```
Permissions:
├── orders.create, orders.read, orders.update, orders.delete
├── inventory.read, inventory.update
├── reports.view
├── users.manage
└── settings.configure
```

---

## DEPLOYMENT & SCALABILITY

### Docker Compose (Development)
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: a3_resto
      POSTGRES_USER: a3_resto
      POSTGRES_PASSWORD: secure_password_here
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  api:
    build: ./apps/api
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://a3_resto:secure_password_here@postgres:5432/a3_resto
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      SENDGRID_API_KEY: ${SENDGRID_API_KEY}
      TWILIO_ACCOUNT_SID: ${TWILIO_ACCOUNT_SID}
      TWILIO_AUTH_TOKEN: ${TWILIO_AUTH_TOKEN}
      TWILIO_PHONE_NUMBER: ${TWILIO_PHONE_NUMBER}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    ports:
      - "3001:3001"

  web:
    build: ./apps/web
    depends_on:
      - api
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - "3000:3000"

  nginx:
    image: nginx:1.27-alpine
    depends_on:
      - api
      - web
    volumes:
      - ./deploy/nginx/a3-resto.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - "80:80"
      - "443:443"

volumes:
  postgres_data:
  redis_data:
```

### Production Deployment

**Infrastructure**:
- **Compute**: AWS ECS + Fargate (or Kubernetes)
- **Database**: AWS RDS PostgreSQL with Multi-AZ
- **Cache**: AWS ElastiCache Redis
- **Storage**: AWS S3 for backups/images
- **CDN**: CloudFront for static assets
- **Monitoring**: Datadog + Sentry + CloudWatch

**Load Testing**:
- 1000 concurrent users per restaurant
- 100,000 orders/day capacity
- 99.95% uptime SLA

---

## IMPLEMENTATION TIMELINE

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Infrastructure (Week 1-4)                          │
│ ├─ Redis + Caching                                          │
│ ├─ BullMQ Queue System                                      │
│ ├─ Environment Management                                   │
│ └─ Audit Logging                                            │
├─────────────────────────────────────────────────────────────┤
│ Phase 3: Notifications (Week 5-8)                           │
│ ├─ Email System (SendGrid)                                  │
│ ├─ SMS System (Twilio)                                      │
│ └─ Push Notifications                                       │
├─────────────────────────────────────────────────────────────┤
│ Phase 4: AI & Analytics (Week 9-12)                         │
│ ├─ OpenAI Integration                                       │
│ ├─ Advanced Analytics                                       │
│ └─ Real-Time Dashboards                                     │
├─────────────────────────────────────────────────────────────┤
│ Phase 5: Monitoring (Week 13-16)                            │
│ ├─ Sentry Error Monitoring                                  │
│ ├─ Uptime Monitoring                                        │
│ ├─ Performance Optimization                                 │
│ └─ Kubernetes Preparation                                   │
├─────────────────────────────────────────────────────────────┤
│ Phase 6: Advanced Features (Week 17-20)                     │
│ ├─ Payment Processing (Stripe)                              │
│ ├─ Data Export & Reporting                                  │
│ ├─ Multi-Language Support                                   │
│ └─ Advanced Permissions (ACL)                               │
└─────────────────────────────────────────────────────────────┘

Timeline: 5 months total (20 weeks)
Target: Production ready by November 2026
```

---

## CRITICAL SUCCESS FACTORS

1. **Security**
   - All secrets in environment variables
   - Rate limiting on all endpoints
   - Input validation + SQL injection prevention
   - OAuth 2.0 for third-party integrations

2. **Scalability**
   - Horizontal scaling architecture (stateless)
   - Database connection pooling
   - Redis caching strategy
   - CDN for static assets

3. **Reliability**
   - Automated backups with PITR
   - Error monitoring & alerting
   - Graceful degradation
   - Circuit breakers for external APIs

4. **Performance**
   - <500ms API response times
   - <2s page load times
   - Real-time updates via WebSockets
   - Lazy-loading for large datasets

5. **Compliance**
   - GDPR data retention policies
   - PCI-DSS for payment processing
   - Audit logging for all mutations
   - Data encryption in transit + at rest

---

## DEPENDENCIES SUMMARY

**Backend Additional**:
```json
{
  "@nestjs/cache-manager": "^2.1.0",
  "@nestjs/bull": "^10.0.1",
  "bull": "^4.11.4",
  "@nestjs/config": "^3.0.0",
  "cache-manager": "^5.3.1",
  "cache-manager-redis-store": "^3.0.0",
  "redis": "^4.6.0",
  "@socket.io/redis-adapter": "^8.2.0",
  "@sendgrid/mail": "^7.7.0",
  "nodemailer": "^6.9.7",
  "@nestjs-modules/mailer": "^1.11.2",
  "twilio": "^4.0.0",
  "openai": "^4.31.0",
  "@sentry/node": "^7.80.0",
  "stripe": "^13.0.0",
  "winston": "^3.11.0",
  "fast-csv": "^4.3.0",
  "puppeteer": "^22.0.0"
}
```

**Frontend Additional**:
```json
{
  "@sentry/nextjs": "^7.80.0",
  "next-i18next": "^14.0.0",
  "@hookform/resolvers": "^3.3.0",
  "react-hook-form": "^7.47.0"
}
```

---

## NEXT STEPS

1. **Week 1-2**: Review & approve roadmap
2. **Week 3**: Begin Phase 2 - Redis setup
3. **Week 4**: Deploy to staging
4. **Week 5**: Begin Phase 3 - Email/SMS
5. ... continue phases

**Start with Phase 2.1 (Redis) - highest impact for scalability**

---

**Document Version**: 1.0
**Last Updated**: June 2026
**Author**: AI Senior Architect
**Status**: Ready for Implementation
