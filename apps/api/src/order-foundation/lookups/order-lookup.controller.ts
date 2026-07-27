import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderLookupService } from './order-lookup.service';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Order Foundation — Reference Lookups')
@PublicTenant()
@Controller('order-lookups')
export class OrderLookupController {
  constructor(private readonly service: OrderLookupService) {}

  @Get('order-types')
  @ApiOperation({ summary: 'Get order classification types' })
  getOrderTypes() {
    return this.service.getOrderTypes();
  }

  @Get('order-statuses')
  @ApiOperation({ summary: 'Get universal order lifecycle statuses' })
  getOrderStatuses() {
    return this.service.getOrderStatuses();
  }

  @Get('fulfillment-types')
  @ApiOperation({ summary: 'Get order fulfillment types' })
  getFulfillmentTypes() {
    return this.service.getFulfillmentTypes();
  }

  @Get('fulfillment-statuses')
  @ApiOperation({ summary: 'Get order fulfillment statuses' })
  getFulfillmentStatuses() {
    return this.service.getFulfillmentStatuses();
  }

  @Get('transaction-types')
  @ApiOperation({ summary: 'Get universal commercial transaction types' })
  getTransactionTypes() {
    return this.service.getTransactionTypes();
  }
}
