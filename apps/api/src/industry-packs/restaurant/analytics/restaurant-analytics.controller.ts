import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RestaurantAnalyticsService } from './restaurant-analytics.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@ApiTags('Restaurant Pack — Analytics & Integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurant-analytics')
export class RestaurantAnalyticsController {
  constructor(private readonly service: RestaurantAnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Retrieve restaurant performance metrics' })
  async getMetrics(@Query('tenantId') tenantId: string) {
    return this.service.getRestaurantMetrics(tenantId || 'GLOBAL');
  }

  @Post('qr-generator')
  @ApiOperation({ summary: 'Generate QR code images for table checkins' })
  async generateQrCode(@Body() body: { text: string }) {
    return this.service.generateQrCodeImage(body.text);
  }

  @Get('guest-preferences')
  @ApiOperation({
    summary:
      'Retrieve guest preferences for guest mobile application integration',
  })
  async getGuestPreferences(@Query('customerId') customerId: string) {
    return this.service.getGuestPreferences(customerId);
  }
}
