import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderTypesService } from './order-types.service';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Order Foundation — Order Types')
@PublicTenant()
@Controller('order-types')
export class OrderTypesController {
  constructor(private readonly service: OrderTypesService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get order classification types (Sales, Purchase, Service, Rental, Subscription, Work, Reservation)',
  })
  getOrderTypes() {
    return this.service.getOrderTypes();
  }
}
