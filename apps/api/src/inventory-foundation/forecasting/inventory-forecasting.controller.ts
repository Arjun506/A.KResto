import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryForecastingService } from './inventory-forecasting.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Forecasting Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory/forecasts')
export class InventoryForecastingController {
  constructor(private readonly service: InventoryForecastingService) {}

  @Post(':inventoryItemId')
  @ApiOperation({
    summary: 'Generate demand forecast and safety stock recommendations',
  })
  async generateForecast(
    @Param('inventoryItemId') inventoryItemId: string,
    @Query('period') period?: string,
  ) {
    return this.service.generateForecast(inventoryItemId, period);
  }

  @Get(':inventoryItemId')
  @ApiOperation({ summary: 'Get latest forecast for an inventory item' })
  async getLatestForecast(@Param('inventoryItemId') inventoryItemId: string) {
    return this.service.getLatestForecast(inventoryItemId);
  }
}
