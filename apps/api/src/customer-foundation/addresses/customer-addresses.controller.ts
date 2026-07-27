import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerAddressesService } from './customer-addresses.service';
import { CreateCustomerAddressDto } from './create-address.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId/addresses')
export class CustomerAddressesController {
  constructor(private readonly service: CustomerAddressesService) {}

  @Post()
  @ApiOperation({
    summary:
      'Add customer physical/logical address (Home, Work, Billing, Shipping)',
  })
  async addAddress(
    @Param('customerId') customerId: string,
    @Body() dto: CreateCustomerAddressDto,
  ) {
    return this.service.addAddress(customerId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List addresses for a customer' })
  async getAddresses(@Param('customerId') customerId: string) {
    return this.service.getAddresses(customerId);
  }

  @Delete(':addressId')
  @ApiOperation({ summary: 'Soft delete customer address' })
  async softDeleteAddress(@Param('addressId') addressId: string) {
    return this.service.softDeleteAddress(addressId);
  }
}
