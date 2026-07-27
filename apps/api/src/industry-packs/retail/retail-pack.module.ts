import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusModule } from '../../event-bus/event-bus.module';

import { RetailService } from './retail.service';
import { RetailController } from './retail.controller';

@Module({
  imports: [EventBusModule],
  controllers: [RetailController],
  providers: [PrismaService, RetailService],
  exports: [RetailService],
})
export class RetailPackModule {}
