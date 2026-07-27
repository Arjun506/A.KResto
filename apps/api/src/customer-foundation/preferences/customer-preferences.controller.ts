import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerPreferencesService } from './customer-preferences.service';
import {
  UpdatePreferencesDto,
  UpdateCommunicationsDto,
} from './update-preferences.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Preferences & Communications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId')
export class CustomerPreferencesController {
  constructor(private readonly service: CustomerPreferencesService) {}

  @Get('preferences')
  @ApiOperation({
    summary: 'Get customer regional preferences and privacy settings',
  })
  async getPreferences(@Param('customerId') customerId: string) {
    return this.service.getPreferences(customerId);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update customer regional preferences' })
  async updatePreferences(
    @Param('customerId') customerId: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.service.updatePreferences(customerId, dto);
  }

  @Get('communications')
  @ApiOperation({
    summary: 'Get customer omnichannel communication opt-in settings',
  })
  async getCommunications(@Param('customerId') customerId: string) {
    return this.service.getCommunications(customerId);
  }

  @Patch('communications')
  @ApiOperation({
    summary:
      'Update customer communication preferences (Email, SMS, Push, WhatsApp)',
  })
  async updateCommunications(
    @Param('customerId') customerId: string,
    @Body() dto: UpdateCommunicationsDto,
  ) {
    return this.service.updateCommunications(customerId, dto);
  }

  @Get('communications/history')
  @ApiOperation({
    summary: 'Get immutable customer communication history logs',
  })
  async getCommunicationHistory(@Param('customerId') customerId: string) {
    return this.service.getCommunicationHistory(customerId);
  }
}
