import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { TablesController } from './tables.controller';

@Module({
  controllers: [RestaurantsController, TablesController],
  providers: [RestaurantsService, PrismaService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
