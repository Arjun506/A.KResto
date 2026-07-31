import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusModule } from '../../event-bus/event-bus.module';

import { HealthcareService } from './healthcare.service';
import { HealthcareController } from './healthcare.controller';

@Module({
  imports: [EventBusModule],
  controllers: [HealthcareController],
  providers: [HealthcareService],
  exports: [HealthcareService],
})
export class HealthcarePackModule {}
