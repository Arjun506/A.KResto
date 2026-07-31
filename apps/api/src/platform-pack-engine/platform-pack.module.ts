import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusModule } from '../event-bus/event-bus.module';

import { PackRegistryService } from './pack-registry.service';
import { ManifestValidatorService } from './manifest-validator.service';
import { PackLifecycleService } from './pack-lifecycle.service';
import { PackHealthService } from './pack-health.service';
import { PlatformPackEngineController } from './platform-pack-engine.controller';

@Module({
  imports: [EventBusModule],
  controllers: [PlatformPackEngineController],
  providers: [PackRegistryService,
    ManifestValidatorService,
    PackLifecycleService,
    PackHealthService],
  exports: [
    PackRegistryService,
    ManifestValidatorService,
    PackLifecycleService,
    PackHealthService,
  ],
})
export class PlatformPackModule {}
