import { Controller, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerProfileService } from './customer-profile.service';
import { UpdateCustomerProfileDto } from './update-profile.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId/profile')
export class CustomerProfileController {
  constructor(private readonly service: CustomerProfileService) {}

  @Patch()
  @ApiOperation({
    summary: 'Update customer personal profile information and metadata',
  })
  async updateProfile(
    @Param('customerId') customerId: string,
    @Body() dto: UpdateCustomerProfileDto,
  ) {
    return this.service.updateProfile(customerId, dto);
  }
}
