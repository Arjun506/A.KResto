import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustIdentityService } from './cust-identity.service';
import { CustSearchService } from './cust-search.service';
import { CustWalletService } from './cust-wallet.service';
import { CustCapabilityService } from './cust-capability.service';
import { CustCheckoutService } from './cust-checkout.service';
import { CustReviewsService } from './cust-reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Universal Customer Experience Platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer-platform')
export class CustomerPlatformController {
  constructor(
    private readonly identity: CustIdentityService,
    private readonly search: CustSearchService,
    private readonly wallet: CustWalletService,
    private readonly capability: CustCapabilityService,
    private readonly checkout: CustCheckoutService,
    private readonly reviews: CustReviewsService,
  ) {}

  @Get('profile/:customerId')
  @ApiOperation({ summary: 'Get Customer Federated profile options' })
  async getProfile(@Param('customerId') customerId: string) {
    return this.identity.getCustomerFederatedProfile(customerId);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search keyword catalogs across active Industry Packs',
  })
  async searchCatalog(
    @Query('tenantId') tenantId: string,
    @Query('query') query: string,
  ) {
    return this.search.searchCatalog(tenantId || 'GLOBAL', query);
  }

  @Get('capabilities')
  @ApiOperation({
    summary: 'Detect active capabilities based on registered Industry Packs',
  })
  async getCapabilities() {
    return this.capability.getActiveCapabilities();
  }

  @Post('cart')
  @ApiOperation({ summary: 'Update universal shopping cart' })
  async updateCart(
    @Body()
    body: {
      tenantId?: string;
      customerId: string;
      businessId: string;
      items: any[];
    },
  ) {
    return this.checkout.updateCart(
      body.tenantId || 'GLOBAL',
      body.customerId,
      body.businessId,
      body.items,
    );
  }

  @Post('checkout')
  @ApiOperation({
    summary: 'Process universal checkout using Payment Foundation',
  })
  async processCheckout(
    @Body()
    body: {
      tenantId?: string;
      customerId: string;
      businessId: string;
      amount: number;
    },
  ) {
    return this.checkout.processCheckout(
      body.tenantId || 'GLOBAL',
      body.customerId,
      body.businessId,
      body.amount,
    );
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Submit rating reviews for outlets/items' })
  async submitReview(
    @Body()
    body: {
      tenantId?: string;
      customerId: string;
      targetType: string;
      targetId: string;
      rating: number;
      comment?: string;
    },
  ) {
    return this.reviews.submitReview(
      body.tenantId || 'GLOBAL',
      body.customerId,
      body.targetType,
      body.targetId,
      body.rating,
      body.comment,
    );
  }

  @Post('consent')
  @ApiOperation({
    summary: 'Update personal privacy settings (opt-outs, GDPR consents)',
  })
  async updateConsent(
    @Body()
    body: {
      customerId: string;
      marketingConsent: boolean;
      gdprOptOut: boolean;
    },
  ) {
    return this.reviews.updatePrivacyConsent(
      body.customerId,
      body.marketingConsent,
      body.gdprOptOut,
    );
  }

  @Get('wallet/:customerId')
  @ApiOperation({
    summary: 'Get Digital wallet details and subscription plan metrics',
  })
  async getWallet(@Param('customerId') customerId: string) {
    const balances = await this.wallet.getWalletBalance(customerId);
    const sub = await this.wallet.getSubscriptionDetails(customerId);
    return {
      balances,
      subscription: sub,
    };
  }
}
