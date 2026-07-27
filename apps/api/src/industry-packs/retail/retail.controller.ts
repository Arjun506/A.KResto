import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RetailService } from './retail.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { CreatePurchaseOrderDto } from './dto/create-po.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Retail Industry Pack — Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('retail')
export class RetailController {
  constructor(private readonly service: RetailService) {}

  @Post('stores')
  @ApiOperation({ summary: 'Register a store branch' })
  async createStore(@Body() body: CreateStoreDto & { tenantId?: string }) {
    return this.service.createStore(body.tenantId || 'GLOBAL', body);
  }

  @Get('stores')
  @ApiOperation({ summary: 'List stores' })
  async listStores(@Query('tenantId') tenantId: string) {
    return this.service.listStores(tenantId || 'GLOBAL');
  }

  @Post('stores/:id/registers')
  @ApiOperation({ summary: 'Add a checkout register terminal' })
  async addRegister(@Param('id') id: string, @Body() body: { code: string }) {
    return this.service.createRegister(id, body.code);
  }

  @Post('variants')
  @ApiOperation({ summary: 'Configure variant attributes' })
  async createVariant(@Body() body: CreateVariantDto) {
    return this.service.createProductVariant(body);
  }

  @Post('stock/batches')
  @ApiOperation({ summary: 'Log stock expiry dates' })
  async createBatch(
    @Body()
    body: {
      productId: string;
      batchNumber: string;
      expiryDate?: string;
      tenantId?: string;
    },
  ) {
    return this.service.createStockBatch(
      body.tenantId || 'GLOBAL',
      body.productId,
      body.batchNumber,
      body.expiryDate,
    );
  }

  @Post('suppliers')
  @ApiOperation({ summary: 'Register supplier properties' })
  async createSupplier(
    @Body() body: { name: string; email?: string; tenantId?: string },
  ) {
    return this.service.createSupplier(
      body.tenantId || 'GLOBAL',
      body.name,
      body.email,
    );
  }

  @Post('procurement/purchase-orders')
  @ApiOperation({ summary: 'File a replenishment purchase order' })
  async createPO(@Body() body: CreatePurchaseOrderDto & { tenantId?: string }) {
    return this.service.createPurchaseOrder(body.tenantId || 'GLOBAL', body);
  }

  @Patch('procurement/purchase-orders/:id/receive')
  @ApiOperation({ summary: 'Verify goods receipt and close PO' })
  async receivePO(@Param('id') id: string) {
    return this.service.receivePurchaseOrder(id);
  }

  @Post('promotions')
  @ApiOperation({ summary: 'Configure campaign coupon codes' })
  async createPromo(@Body() body: CreatePromotionDto & { tenantId?: string }) {
    return this.service.createPromotion(body.tenantId || 'GLOBAL', body);
  }

  @Post('pos/checkout')
  @ApiOperation({ summary: 'Complete POS shopping transactions' })
  async checkout(
    @Body()
    body: {
      tenantId?: string;
      registerId: string;
      orderNumber: string;
      items: Array<{ productId: string; qty: number; price: number }>;
      promoCode?: string;
    },
  ) {
    return this.service.checkoutPOS(
      body.tenantId || 'GLOBAL',
      body.registerId,
      body.orderNumber,
      body.items,
      body.promoCode,
    );
  }

  @Post('returns')
  @ApiOperation({ summary: 'Authorize exchanges returns' })
  async createReturn(
    @Body()
    body: {
      tenantId?: string;
      orderId: string;
      reason: string;
      refundAmount: number;
    },
  ) {
    return this.service.authorizeReturn(
      body.tenantId || 'GLOBAL',
      body.orderId,
      body.reason,
      body.refundAmount,
    );
  }

  @Post('stock/transfer')
  @ApiOperation({ summary: 'Transfer stock between warehouses' })
  async transfer(
    @Body()
    body: {
      tenantId?: string;
      productId: string;
      sourceStoreId: string;
      destStoreId: string;
      quantity: number;
    },
  ) {
    return this.service.transferStock(
      body.tenantId || 'GLOBAL',
      body.productId,
      body.sourceStoreId,
      body.destStoreId,
      body.quantity,
    );
  }

  @Get('analytics')
  @ApiOperation({
    summary: 'Retrieve margins and basket size analytics metrics',
  })
  async getAnalytics(@Query('tenantId') tenantId: string) {
    return this.service.fetchRetailAnalytics(tenantId || 'GLOBAL');
  }

  @Post('loyalty/award')
  @ApiOperation({ summary: 'Credit loyalty points balance' })
  async awardPoints(@Body() body: { customerId: string; amountSpent: number }) {
    return this.service.awardLoyaltyPoints(body.customerId, body.amountSpent);
  }
}
