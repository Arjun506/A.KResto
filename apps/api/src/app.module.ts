import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EnvConfigModule } from './config/env-validation.module';
import { AuthModule } from './auth/auth.module';
import { IamModule } from './iam/iam.module';
import { TenantModule } from './tenant/tenant.module';
import { OrganizationModule } from './organization/organization.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuditModule } from './audit/audit.module';
import { EventBusModule } from './event-bus/event-bus.module';
import { NotificationPlatformModule } from './notification-platform/notification-platform.module';
import { FilePlatformModule } from './file-platform/file-platform.module';
import { SearchModule } from './search/search.module';
import { PlatformSettingsModule } from './platform-settings/platform-settings.module';
import { HealthModule } from './health/health.module';
import { BusinessFoundationModule } from './business-foundation/business-foundation.module';
import { CustomerFoundationModule } from './customer-foundation/customer-foundation.module';
import { ProductFoundationModule } from './product-foundation/product-foundation.module';
import { PricingFoundationModule } from './pricing-foundation/pricing-foundation.module';
import { InventoryFoundationModule } from './inventory-foundation/inventory-foundation.module';
import { OrderFoundationModule } from './order-foundation/order-foundation.module';
import { PaymentFoundationModule } from './payment-foundation/payment-foundation.module';
import { WorkflowFoundationModule } from './workflow-foundation/workflow-foundation.module';
import { CrmFoundationModule } from './crm-foundation/crm-foundation.module';
import { RestaurantPackModule } from './industry-packs/restaurant/restaurant-pack.module';
import { PlatformPackModule } from './platform-pack-engine/platform-pack.module';
import { CustPlatformModule } from './customer-platform/cust-platform.module';
import { BusinessConsoleModule } from './business-console/business-console.module';
import { AiPlatformModule } from './ai-platform/ai-platform.module';
import { HotelPackModule } from './industry-packs/hotel/hotel-pack.module';
import { RetailPackModule } from './industry-packs/retail/retail-pack.module';
import { HealthcarePackModule } from './industry-packs/healthcare/healthcare-pack.module';
import { LogisticsPackModule } from './industry-packs/logistics/logistics-pack.module';
import { SaasCommerceModule } from './saas-commerce/saas-commerce.module';
import { SecurityModule } from './security/security.module';
import { CacheConfigModule } from './cache/cache.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { MenuModule } from './menu/menu.module';
import { BusinessModule } from './business/business.module';
import { ReservationsModule } from './reservations/reservations.module';
import { OrdersModule } from './orders/orders.module';
import { PosRegisterModule } from './pos-register/pos-register.module';
import { KitchenModule } from './kitchen/kitchen.module';

import { PrismaModule } from './prisma/prisma.module';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';

import { BranchModule } from './branch/branch.module';
import { BranchMenuModule } from './branch-menu/branch-menu.module';
import { BranchInventoryModule } from './branch-inventory/branch-inventory.module';
import { WorkforceModule } from './workforce/workforce.module';

@Module({
  imports: [
    WorkforceModule,
    EnvConfigModule,
    PrismaModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL', 60000),
          limit: config.get<number>('THROTTLE_LIMIT', 20),
        },
      ],
    }),
    AuthModule,
    IamModule,
    TenantModule,
    OrganizationModule,
    PermissionsModule,
    AuditModule,
    EventBusModule,
    NotificationPlatformModule,
    FilePlatformModule,
    SearchModule,
    PlatformSettingsModule,
    HealthModule,
    BusinessFoundationModule,
    CustomerFoundationModule,
    ProductFoundationModule,
    PricingFoundationModule,
    InventoryFoundationModule,
    OrderFoundationModule,
    PaymentFoundationModule,
    WorkflowFoundationModule,
    CrmFoundationModule,
    RestaurantPackModule,
    PlatformPackModule,
    CustPlatformModule,
    BusinessConsoleModule,
    AiPlatformModule,
    HotelPackModule,
    RetailPackModule,
    HealthcarePackModule,
    LogisticsPackModule,
    SaasCommerceModule,
    SecurityModule,
    CacheConfigModule,
    RestaurantsModule,
    MenuModule,
    BusinessModule,
    ReservationsModule,
    OrdersModule,
    PosRegisterModule,
    KitchenModule,
    BranchModule,
    BranchMenuModule,
    BranchInventoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
