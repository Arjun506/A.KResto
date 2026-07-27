import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PricingCalendarsService } from './pricing-calendars.service';
import { CreatePricingCalendarDto } from './create-calendar.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Effective Calendars')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pricing-calendars')
export class PricingCalendarsController {
  constructor(private readonly service: PricingCalendarsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create effective business calendar & blackout schedule',
  })
  async createCalendar(
    @Body() dto: CreatePricingCalendarDto,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.createCalendar(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List pricing calendars' })
  async listCalendars(@Query('tenantId') tenantId?: string) {
    return this.service.listCalendars(tenantId);
  }
}
