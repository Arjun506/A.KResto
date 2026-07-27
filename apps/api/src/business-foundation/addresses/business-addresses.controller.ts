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
import { BusinessAddressesService } from './business-addresses.service';
import { CreateAddressDto } from './create-address.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Business Foundation — Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses/:businessId/addresses')
export class BusinessAddressesController {
  constructor(private readonly service: BusinessAddressesService) {}

  @Post()
  @ApiOperation({
    summary:
      'Add address location (Head Office, Branch, Warehouse, Billing, Shipping, Store)',
  })
  async addAddress(
    @Param('businessId') businessId: string,
    @Body() dto: CreateAddressDto,
  ) {
    return this.service.addAddress(businessId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List physical and logical addresses for a business',
  })
  async getAddresses(@Param('businessId') businessId: string) {
    return this.service.getAddresses(businessId);
  }

  @Delete(':addressId')
  @ApiOperation({ summary: 'Soft delete business address' })
  async softDeleteAddress(@Param('addressId') addressId: string) {
    return this.service.softDeleteAddress(addressId);
  }
}
