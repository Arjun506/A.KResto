import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { OrdersGateway } from '../gateways/orders.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway, PrismaService],
  exports: [OrdersService, OrdersGateway],
})
export class OrdersModule {}
