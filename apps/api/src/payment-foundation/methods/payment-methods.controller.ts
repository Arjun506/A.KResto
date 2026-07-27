import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Payment Foundation — Payment Methods')
@PublicTenant()
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly service: PaymentMethodsService) {}

  @Get()
  @ApiOperation({ summary: 'Get active payment methods' })
  getPaymentMethods() {
    return this.service.getPaymentMethods();
  }
}
