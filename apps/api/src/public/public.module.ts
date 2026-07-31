import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrdersGateway } from '../gateways/orders.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

@Module({
  imports: [AuthModule],
  controllers: [PublicController],
  providers: [PublicService, OrdersGateway],
})
export class PublicModule {}
