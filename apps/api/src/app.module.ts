import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UploadsModule } from './uploads/uploads.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PublicModule } from './public/public.module';
import { BusinessModule } from './business/business.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CapabilitiesPlatformModule } from './capabilities-platform/capabilities-platform.module';
import { ProductCapabilityModule } from './product-capability/product-capability.module';
import { MasterDataModule } from './master-data/master-data.module';
import { PaymentModule } from './payment/payment.module';
import { CloudModule } from './cloud/cloud.module';
import { PosRegisterModule } from './pos-register/pos-register.module';

@Module({
  imports: [
    AuthModule,
    RestaurantsModule,
    OrdersModule,
    MenuModule,
    InventoryModule,
    ReservationsModule,
    UploadsModule,
    AnalyticsModule,
    PublicModule,
    BusinessModule,
    PermissionsModule,
    CapabilitiesPlatformModule,
    ProductCapabilityModule,
    MasterDataModule,
    PaymentModule,
    CloudModule,
    PosRegisterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
