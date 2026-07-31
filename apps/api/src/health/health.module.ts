import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CacheConfigModule } from '../cache/cache.module';
import { QueueModule } from '../queue/queue.module';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [TerminusModule, CacheConfigModule, QueueModule, SecurityModule],
  controllers: [HealthController],
  providers: [CacheService],
})
export class HealthModule {}
