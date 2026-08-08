import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { OrdersGateway } from '../gateways/orders.gateway';
import { KitchenService } from './kitchen.service';
import { KitchenStationsService } from './kitchen-stations.service';
import { KitchenController } from './kitchen.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [KitchenController],
  providers: [KitchenService, KitchenStationsService, OrdersGateway],
  exports: [KitchenService, KitchenStationsService, OrdersGateway],
})
export class KitchenModule {}
