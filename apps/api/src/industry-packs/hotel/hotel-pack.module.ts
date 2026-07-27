import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusModule } from '../../event-bus/event-bus.module';

import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';

@Module({
  imports: [EventBusModule],
  controllers: [HotelController],
  providers: [PrismaService, HotelService],
  exports: [HotelService],
})
export class HotelPackModule {}
