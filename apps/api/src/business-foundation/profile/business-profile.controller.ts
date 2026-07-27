import { Controller, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessProfileService } from './business-profile.service';
import { UpdateBusinessProfileDto } from './update-profile.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Foundation — Profile & Branding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses/:businessId/profile')
export class BusinessProfileController {
  constructor(private readonly service: BusinessProfileService) {}

  @Patch()
  @ApiOperation({
    summary:
      'Update business profile, legal names, branding, logo, banner, and social links',
  })
  async updateProfile(
    @Param('businessId') businessId: string,
    @Body() dto: UpdateBusinessProfileDto,
  ) {
    return this.service.updateProfile(businessId, dto);
  }
}
