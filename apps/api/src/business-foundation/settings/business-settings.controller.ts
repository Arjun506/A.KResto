import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessSettingsService } from './business-settings.service';
import { UpdateBusinessSettingsDto } from './dto/update-business-settings.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Foundation — Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses/:businessId/settings')
export class BusinessSettingsController {
  constructor(private readonly service: BusinessSettingsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get business regional settings, locale, working hours, and fiscal year configuration',
  })
  async getSettings(@Param('businessId') businessId: string) {
    return this.service.getSettings(businessId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update business settings & preferences' })
  async updateSettings(
    @Param('businessId') businessId: string,
    @Body() dto: UpdateBusinessSettingsDto,
  ) {
    return this.service.upsertSettings(businessId, dto);
  }
}
