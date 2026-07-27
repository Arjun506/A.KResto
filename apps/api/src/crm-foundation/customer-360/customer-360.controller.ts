import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Customer360Service } from './customer-360.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('CRM Foundation — Customer 360')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm-customer-360')
export class Customer360Controller {
  constructor(private readonly service: Customer360Service) {}

  @Get(':customerId')
  @ApiOperation({ summary: 'Retrieve unified Customer 360 profile view' })
  async getProfile(@Param('customerId') customerId: string) {
    return this.service.getCustomer360Profile(customerId);
  }
}
