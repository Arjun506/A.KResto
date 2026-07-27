import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionRecordDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Universal Transaction Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order-transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Register a commercial transaction (Quote, Estimate, Reservation, Booking, Subscription, Invoice, Service Ticket)',
  })
  async createTransaction(@Body() dto: CreateTransactionRecordDto) {
    return this.service.createTransaction(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List universal commercial transactions' })
  async getTransactions(
    @Query('tenantId') tenantId?: string,
    @Query('orderId') orderId?: string,
  ) {
    return this.service.getTransactions(tenantId, orderId);
  }
}
