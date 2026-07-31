import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { OrdersGateway } from '../gateways/orders.gateway';
import { InventoryModule } from '../inventory/inventory.module';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [AuthModule, InventoryModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway],
  exports: [OrdersService, OrdersGateway],
})
export class OrdersModule {}
