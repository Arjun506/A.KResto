import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusModule } from '../../event-bus/event-bus.module';

import { LogisticsService } from './logistics.service';
import { LogisticsController } from './logistics.controller';

@Module({
  imports: [EventBusModule],
  controllers: [LogisticsController],
  providers: [PrismaService, LogisticsService],
  exports: [LogisticsService],
})
export class LogisticsPackModule {}
