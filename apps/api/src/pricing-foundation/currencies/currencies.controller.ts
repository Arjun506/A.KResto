import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto, SetExchangeRateDto } from './create-currency.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Currencies & Exchange Rates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @Post()
  @ApiOperation({ summary: 'Create ISO multi-currency definition' })
  async createCurrency(
    @Body() dto: CreateCurrencyDto,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.createCurrency(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List supported currencies' })
  async listCurrencies(@Query('tenantId') tenantId?: string) {
    return this.service.listCurrencies(tenantId);
  }

  @Post('exchange-rates')
  @ApiOperation({ summary: 'Set currency exchange conversion rate' })
  async setExchangeRate(@Body() dto: SetExchangeRateDto) {
    return this.service.setExchangeRate(dto);
  }
}
