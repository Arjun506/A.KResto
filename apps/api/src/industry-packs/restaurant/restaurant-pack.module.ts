import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusModule } from '../../event-bus/event-bus.module';

import { RestaurantCoreService } from './core/restaurant-core.service';
import { RestaurantCoreController } from './core/restaurant-core.controller';

import { RestaurantDiningService } from './dining/restaurant-dining.service';
import { RestaurantDiningController } from './dining/restaurant-dining.controller';

import { RestaurantOpsService } from './ops/restaurant-ops.service';
import { RestaurantOpsController } from './ops/restaurant-ops.controller';

import { RestaurantAnalyticsService } from './analytics/restaurant-analytics.service';
import { RestaurantAnalyticsController } from './analytics/restaurant-analytics.controller';

@Module({
  imports: [EventBusModule],
  controllers: [
    RestaurantCoreController,
    RestaurantDiningController,
    RestaurantOpsController,
    RestaurantAnalyticsController,
  ],
  providers: [
    PrismaService,
    RestaurantCoreService,
    RestaurantDiningService,
    RestaurantOpsService,
    RestaurantAnalyticsService,
  ],
  exports: [
    RestaurantCoreService,
    RestaurantDiningService,
    RestaurantOpsService,
    RestaurantAnalyticsService,
  ],
})
export class RestaurantPackModule {}
