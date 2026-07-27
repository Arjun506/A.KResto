import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerLoyaltyService } from './customer-loyalty.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Loyalty Baseline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId/loyalty')
export class CustomerLoyaltyController {
  constructor(private readonly service: CustomerLoyaltyService) {}

  @Get()
  @ApiOperation({
    summary: 'Get customer loyalty tier, membership status, and points balance',
  })
  async getLoyaltyRecord(@Param('customerId') customerId: string) {
    return this.service.getLoyaltyRecord(customerId);
  }
}
