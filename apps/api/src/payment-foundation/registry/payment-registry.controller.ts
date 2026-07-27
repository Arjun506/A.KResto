import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentRegistryService } from './payment-registry.service';
import { CreatePaymentTransactionDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentRegistryController {
  constructor(private readonly service: PaymentRegistryService) {}

  @Post()
  @ApiOperation({ summary: 'Register a payment transaction' })
  async createPayment(@Body() dto: CreatePaymentTransactionDto) {
    return this.service.createPayment(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a payment transaction' })
  async getPayment(@Param('id') id: string) {
    return this.service.getPayment(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get payment transactions for an order' })
  async getPaymentsByOrder(@Query('orderId') orderId: string) {
    return this.service.getPaymentsByOrder(orderId);
  }
}
