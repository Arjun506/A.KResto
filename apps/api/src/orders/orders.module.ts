import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { OrdersGateway } from '../gateways/orders.gateway';
import { InventoryModule } from '../inventory/inventory.module';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

import { KitchenModule } from '../kitchen/kitchen.module';

@Module({
  imports: [AuthModule, InventoryModule, KitchenModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway],
  exports: [OrdersService, OrdersGateway],
})
export class OrdersModule {}
