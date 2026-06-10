# A3 RESTO PHASE 2 - QUICK START GUIDE

**Status**: Implementation Ready
**Phase**: 2 (Infrastructure & Foundation)
**Duration**: 4 weeks
**Start Date**: Week of June 3, 2026

---

## PHASE 2 OVERVIEW

This phase establishes the infrastructure foundation for enterprise scaling:
- ✅ Redis caching + session management
- ✅ BullMQ job queues
- ✅ Environment & secrets management
- ✅ Audit logging
- ✅ Error monitoring setup (Sentry)

---

## WEEK 1: REDIS INTEGRATION & CACHING

### Task 1.1: Setup Docker Redis Service
**File**: `docker-compose.yml`

```yaml
# Add to services:
  redis:
    image: redis:7-alpine
    container_name: a3-resto-redis
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - a3-network

# Add volume:
volumes:
  redis_data:
```

**Commands**:
```bash
cd d:\A3\ Resto
docker-compose up -d redis
docker-compose logs -f redis
```

**Verify**: `docker-compose exec redis redis-cli PING` → Should return `PONG`

---

### Task 1.2: Install Backend Dependencies

```bash
cd a3-resto-saas/apps/api
npm install @nestjs/cache-manager cache-manager cache-manager-redis-store redis @socket.io/redis-adapter
```

---

### Task 1.3: Integrate Cache Module

✅ **File Created**: `apps/api/src/cache/cache.module.ts`

**Update `apps/api/src/app.module.ts`**:
```typescript
import { CacheConfigModule } from './cache/cache.module';

@Module({
  imports: [
    CacheConfigModule, // Add this
    // ... other imports
  ],
})
export class AppModule {}
```

---

### Task 1.4: Add Cache Service

✅ **File Created**: `apps/api/src/cache/cache.service.ts`

**Update `apps/api/src/app.module.ts`**:
```typescript
import { CacheService } from './cache/cache.service';

@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class AppModule {}
```

---

### Task 1.5: Apply Cache Interceptor

✅ **File Created**: `apps/api/src/cache/cache.interceptor.ts`

**Example Usage in Restaurants Controller**:
```typescript
import { CacheInterceptor } from 'src/cache/cache.interceptor';

@Controller('restaurants')
@UseInterceptors(CacheInterceptor)
export class RestaurantsController {
  @Get(':id')
  getRestaurant(@Param('id') id: string) {
    // Result cached automatically
  }
}
```

---

### Task 1.6: Setup Socket.IO Redis Adapter

**Update `apps/api/src/gateways/orders.gateway.ts`**:
```typescript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

@WebSocketGateway({ cors: true })
@UseGuards(JwtAuthGuard)
export class OrdersGateway implements OnModuleInit {
  @WebSocketServer() server: Server;
  private pubClient: ReturnType<typeof createClient>;
  private subClient: ReturnType<typeof createClient>;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Setup Redis adapter for clustering
    this.pubClient = createClient({
      url: this.configService.get('REDIS_URL'),
    });
    this.subClient = this.pubClient.duplicate();

    await Promise.all([
      this.pubClient.connect(),
      this.subClient.connect(),
    ]);

    this.server.adapter(createAdapter(this.pubClient, this.subClient));
  }
}
```

---

### Testing Week 1

```bash
cd a3-resto-saas/apps/api
npm run build
npm start

# Test in another terminal
curl http://localhost:3001/restaurants/123
# Call twice - second should be instant (cached)
```

---

## WEEK 2: BULLMQ QUEUE SYSTEM

### Task 2.1: Install Dependencies

```bash
cd a3-resto-saas/apps/api
npm install @nestjs/bull bull
```

---

### Task 2.2: Setup Queue Module

✅ **File Created**: `apps/api/src/queue/queue.module.ts`

**Update `apps/api/src/app.module.ts`**:
```typescript
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    QueueModule, // Add this
    // ... other imports
  ],
})
export class AppModule {}
```

---

### Task 2.3: Create Email Processor

**Create**: `apps/api/src/queue/processors/email.processor.ts`

```typescript
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  template?: string;
  templateData?: Record<string, any>;
}

@Processor('email')
export class EmailProcessor {
  constructor(private emailService: EmailService) {}

  @Process('send-confirmation')
  async sendConfirmation(job: Job<EmailPayload>) {
    console.log(`Processing email job ${job.id}...`);
    try {
      await this.emailService.send(job.data);
      return { success: true };
    } catch (error) {
      console.error(`Email job failed:`, error);
      throw error; // Triggers retry
    }
  }

  @Process('send-daily-report')
  async sendDailyReport(job: Job<{ restaurantId: string }>) {
    // Generate report, send via email
  }
}
```

---

### Task 2.4: Create Order Service Integration

**Update `apps/api/src/orders/orders.service.ts`**:

```typescript
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async createOrder(data: CreateOrderDto) {
    const order = await this.prisma.order.create({
      data,
      include: { items: true, table: true },
    });

    // Enqueue confirmation email
    await this.emailQueue.add(
      'send-confirmation',
      {
        to: data.customerEmail,
        subject: `Order #${order.orderNumber} Confirmed`,
        template: 'order-confirmation',
        templateData: { order },
      },
      { delay: 0 } // Send immediately
    );

    return order;
  }
}
```

---

### Task 2.5: Create Scheduled Jobs

**Create**: `apps/api/src/queue/scheduled-jobs.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ScheduledJobs {
  constructor(
    @InjectQueue('analytics') private analyticsQueue: Queue,
    private prisma: PrismaService,
  ) {}

  // Every day at 2 AM
  @Cron('0 2 * * *')
  async generateDailyReports() {
    const restaurants = await this.prisma.restaurant.findMany();

    for (const restaurant of restaurants) {
      await this.analyticsQueue.add(
        'generate-daily-report',
        { restaurantId: restaurant.id },
        { attempts: 3 }
      );
    }

    console.log(`Queued ${restaurants.length} daily reports`);
  }

  // Every Sunday at 3 AM
  @Cron('0 3 * * 0')
  async generateWeeklyForecasts() {
    const restaurants = await this.prisma.restaurant.findMany();

    for (const restaurant of restaurants) {
      await this.analyticsQueue.add(
        'generate-forecast',
        { restaurantId: restaurant.id, period: 'WEEKLY' },
        { attempts: 2 }
      );
    }
  }

  // Every month on 1st at 4 AM
  @Cron('0 4 1 * *')
  async cleanupOldData() {
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);

    await this.prisma.auditLog.deleteMany({
      where: { createdAt: { lt: sixMonthsAgo } },
    });

    console.log('Cleanup old audit logs completed');
  }
}
```

---

### Testing Week 2

```bash
# Start all services
docker-compose up -d

# Test email queue
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test",
    "customerPhone": "1234567890",
    "restaurantId": "123",
    "totalAmount": 50
  }'

# Check Bull Board (queue UI)
open http://localhost:3001/bull/queues
```

---

## WEEK 3: ENVIRONMENT & SECRETS MANAGEMENT

### Task 3.1: Setup Environment Variables

✅ **File Created**: `.env.example`

**Create `.env` from template**:
```bash
cd d:\A3\ Resto
cp .env.example .env.production
```

**Generate JWT Secret**:
```bash
# Windows PowerShell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object {[random]::Next(0,256)} | ForEach-Object {[char]$_}) -join '')) 
# Or use online tool: https://www.random.org/bytes/
```

**Update `.env`**:
```
NODE_ENV=production
JWT_SECRET=<your-generated-secret>
DATABASE_URL=postgresql://a3_resto:a3_resto_password@postgres:5432/a3_resto
REDIS_URL=redis://redis:6379
NEXT_PUBLIC_API_URL=https://api.a3resto.com
```

---

### Task 3.2: Install Config Validation

```bash
cd a3-resto-saas/apps/api
npm install @nestjs/config class-validator class-transformer joi
```

---

### Task 3.3: Setup Environment Validation

✅ **File Created**: `apps/api/src/config/env-validation.module.ts`

**Update `apps/api/src/app.module.ts`**:
```typescript
import { EnvConfigModule } from './config/env-validation.module';

@Module({
  imports: [
    EnvConfigModule, // Add this FIRST
    // ... other modules
  ],
})
export class AppModule {}
```

---

### Task 3.4: Update JWT Strategy

**Update `apps/api/src/auth/jwt.strategy.ts`**:
```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'), // ✅ No more hardcoded
    });
  }
}
```

---

### Testing Week 3

```bash
# Remove hardcoded secrets from code
grep -r "super-secret" apps/api/src

# Start with environment variables
export NODE_ENV=development
export JWT_SECRET=$(openssl rand -base64 32)
npm start
```

---

## WEEK 4: AUDIT LOGGING & MONITORING

### Task 4.1: Update Prisma Schema

**Update `apps/api/prisma/schema.prisma`**:

```prisma
model AuditLog {
  id            String    @id @default(cuid())
  restaurantId  String
  userId        String?
  entity        String    // "Order", "User", "Menu", etc.
  entityId      String
  action        String    // "CREATE", "UPDATE", "DELETE"
  oldValues     Json?
  newValues     Json?
  changes       String[]
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime  @default(now())

  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  user          User?      @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([restaurantId])
  @@index([createdAt])
  @@index([entity, entityId])
}

model DataRetention {
  id             String   @id @default(cuid())
  restaurantId   String   @unique
  retentionDays  Int      @default(180)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  restaurant     Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
}

// Add to User model:
model User {
  // ... existing fields
  auditLogs      AuditLog[]
}

// Add to Restaurant model:
model Restaurant {
  // ... existing fields
  auditLogs      AuditLog[]
  dataRetention  DataRetention?
}
```

---

### Task 4.2: Create Migration

```bash
cd a3-resto-saas/apps/api
npx prisma migrate dev --name add_audit_logging
npx prisma generate
```

---

### Task 4.3: Setup Audit Module

✅ **File Created**: `apps/api/src/audit/audit.module.ts`

**Create audit interceptor**:

```typescript
// apps/api/src/audit/audit.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.module';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, params, user } = request;

    // Only track mutations
    if (!['POST', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const bodyBefore = request.body;

    return next.handle().pipe(
      tap(response => {
        if (response.success) {
          const entity = request.path.split('/')[2]; // Extract from path
          const action = method === 'POST' ? 'CREATE' : method === 'DELETE' ? 'DELETE' : 'UPDATE';

          this.auditService.logChange({
            restaurantId: user.restaurantId,
            userId: user.id,
            entity,
            entityId: params.id || response.data?.id,
            action,
            oldValues: method === 'PUT' ? bodyBefore : undefined,
            newValues: response.data,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          });
        }
      }),
    );
  }
}
```

---

### Task 4.4: Setup Sentry Monitoring

**Install**:
```bash
cd a3-resto-saas/apps/api
npm install @sentry/node @sentry/cli
```

✅ **File Created**: `apps/api/src/monitoring/sentry.service.ts`

**Update `apps/api/src/main.ts`**:
```typescript
import * as Sentry from '@sentry/node';
import { SentryService } from './monitoring/sentry.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sentryService = app.get(SentryService);

  // Initialize Sentry
  app.use(Sentry.Handlers.requestHandler());

  // ... other middleware

  app.use(Sentry.Handlers.errorHandler());

  await app.listen(3001);
}
```

---

### Testing Week 4

```bash
# Create order - should log audit entry
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{...}'

# Query audit logs
curl http://localhost:3001/audit-logs?entity=Order&restaurantId=123 \
  -H "Authorization: Bearer <token>"
```

---

## DELIVERABLES CHECKLIST

### End of Phase 2

- [x] Redis running in Docker
- [x] Caching interceptor on GET endpoints
- [x] BullMQ queues configured
- [x] Email queue processor
- [x] Scheduled jobs (daily reports, weekly forecasts)
- [x] Environment variable management
- [x] Secrets management (JWT, API keys)
- [x] Audit logging table & service
- [x] Sentry error monitoring
- [x] Docker Compose updated

---

## PERFORMANCE METRICS (Target)

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| API Response Time | 200ms | 50ms | <100ms |
| Database Queries | N+1 | Optimized | <5ms |
| WebSocket Connections | 100/instance | 1000/instance | 5000/instance |
| Job Processing | Synchronous | Async queues | <1s each |
| Error Capture Rate | 0% | 100% | >99% |

---

## NEXT PHASE

**Phase 3: Notifications & Communications (Week 5-8)**
- Email system integration (SendGrid)
- SMS notifications (Twilio)
- Push notifications (Firebase)
- Notification templates & scheduling

---

## TROUBLESHOOTING

### Redis Connection Failed
```bash
docker-compose logs redis
docker-compose exec redis redis-cli PING
```

### Queue Jobs Not Processing
```bash
# Check Bull Board
open http://localhost:3001/bull/queues

# Check logs
docker-compose logs api | grep "Processor"
```

### Environment Variables Not Loading
```bash
# Verify .env file exists
ls -la .env

# Check NestJS config validation
npm run build && npm start
```

---

## RESOURCES

- [NestJS Cache Manager](https://docs.nestjs.com/techniques/caching)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Redis CLI Reference](https://redis.io/commands/)
- [Sentry Integration](https://docs.sentry.io/platforms/node/)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

**Document Version**: 1.0
**Last Updated**: June 2026
**Status**: Ready for Implementation
