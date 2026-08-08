import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OffersService, CreateOfferDto } from './offers.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../../tenant/tenant.guard';
import { apiSuccess } from '../../common/responses/api-response';

@ApiTags('CRM Foundation — Offers & Coupons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('crm-offers')
export class OffersController {
  constructor(private readonly service: OffersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new customer offer or promo code' })
  async createOffer(@Body() dto: CreateOfferDto, @Req() req: any) {
    const tenantId = req.user?.tenantId || 'GLOBAL';
    const data = await this.service.createOffer(tenantId, dto);
    return apiSuccess(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all active offers for tenant' })
  async getOffers(@Req() req: any) {
    const tenantId = req.user?.tenantId || 'GLOBAL';
    const data = await this.service.getOffers(tenantId);
    return apiSuccess(data);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get applicable offers for a specific customer' })
  async getCustomerApplicableOffers(@Param('customerId') customerId: string, @Req() req: any) {
    const tenantId = req.user?.tenantId || 'GLOBAL';
    const data = await this.service.getCustomerApplicableOffers(tenantId, customerId);
    return apiSuccess(data);
  }
}
