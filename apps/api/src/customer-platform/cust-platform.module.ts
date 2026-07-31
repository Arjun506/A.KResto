import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusModule } from '../event-bus/event-bus.module';

import { CustIdentityService } from './cust-identity.service';
import { CustSearchService } from './cust-search.service';
import { CustWalletService } from './cust-wallet.service';
import { CustCapabilityService } from './cust-capability.service';
import { CustCheckoutService } from './cust-checkout.service';
import { CustReviewsService } from './cust-reviews.service';
import { CustomerPlatformController } from './customer-platform.controller';

@Module({
  imports: [EventBusModule],
  controllers: [CustomerPlatformController],
  providers: [CustIdentityService,
    CustSearchService,
    CustWalletService,
    CustCapabilityService,
    CustCheckoutService,
    CustReviewsService],
  exports: [
    CustIdentityService,
    CustSearchService,
    CustWalletService,
    CustCapabilityService,
    CustCheckoutService,
    CustReviewsService,
  ],
})
export class CustPlatformModule {}
