import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentProvidersService } from './payment-providers.service';
import { CreatePaymentProviderDto } from './dto/create-provider.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Providers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-providers')
export class PaymentProvidersController {
  constructor(private readonly service: PaymentProvidersService) {}

  @Post()
  @ApiOperation({
    summary: 'Register a payment gateway/provider credential configuration',
  })
  async createProvider(@Body() dto: CreatePaymentProviderDto) {
    return this.service.createProvider(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List registered merchant payment providers' })
  async getProviders(@Query('tenantId') tenantId?: string) {
    return this.service.getProviders(tenantId);
  }
}
