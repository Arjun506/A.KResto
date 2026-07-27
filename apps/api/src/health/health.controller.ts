import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { PublicTenant } from '../tenant/public-tenant.decorator';
import { CacheService } from '../cache/cache.service';
import { InjectQueue } from '@nestjs/bull';
import * as Bull from 'bull';
import { KeyManagementService } from '../security/key-management.service';

@ApiTags('Health & Readiness')
@PublicTenant()
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    @InjectQueue('notifications')
    private readonly notificationsQueue: Bull.Queue,
    private readonly kms: KeyManagementService,
  ) {}

  @Get('live')
  @ApiOperation({
    summary: 'Liveness probe indicating application-process health',
  })
  live() {
    return { status: 'up', timestamp: new Date().toISOString() };
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Backward compatible liveness probe' })
  liveness() {
    return this.live();
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({
    summary: 'Readiness probe verifying database, cache, queues, and KMS',
  })
  async ready() {
    return this.health.check([
      // 1. PostgreSQL DB Check
      async () => {
        try {
          await this.prisma.$queryRaw`SELECT 1`;
          return { database: { status: 'up' } };
        } catch (err) {
          return { database: { status: 'down' } };
        }
      },
      // 2. Memory Heap Check
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // 3. Redis Cache Check
      async () => {
        try {
          await this.cache.set('health_check_ping', 'ok', 5);
          const val = await this.cache.get('health_check_ping');
          return val === 'ok'
            ? { cache: { status: 'up' } }
            : { cache: { status: 'down' } };
        } catch (err) {
          return { cache: { status: 'down' } };
        }
      },
      // 4. BullMQ Queue Check
      async () => {
        try {
          const pong = await this.notificationsQueue.client.ping();
          return pong === 'PONG'
            ? { queue: { status: 'up' } }
            : { queue: { status: 'down' } };
        } catch (err) {
          return { queue: { status: 'down' } };
        }
      },
      // 5. KMS/Security Check
      async () => {
        try {
          const testDek = await this.kms.wrapKey(Buffer.from('ping-test'));
          return testDek.length > 0
            ? { securityKms: { status: 'up' } }
            : { securityKms: { status: 'down' } };
        } catch (err) {
          return { securityKms: { status: 'down' } };
        }
      },
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  @ApiOperation({ summary: 'Backward compatible readiness probe' })
  readiness() {
    return this.ready();
  }
}
