import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './create-coupon.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Coupon Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly service: CouponsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create coupon, promo code, voucher, or gift card definition',
  })
  async createCoupon(
    @Body() dto: CreateCouponDto,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.createCoupon(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List active catalog coupons' })
  async listCoupons(@Query('tenantId') tenantId?: string) {
    return this.service.listCoupons(tenantId);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Look up coupon by promo code' })
  async getCouponByCode(@Param('code') code: string) {
    return this.service.getCouponByCode(code);
  }
}
