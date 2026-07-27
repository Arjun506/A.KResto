import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionLedgerService } from './transaction-ledger.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Transaction Ledger')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/ledger')
export class TransactionLedgerController {
  constructor(private readonly service: TransactionLedgerService) {}

  @Get()
  @ApiOperation({
    summary: 'Query double-entry financial transaction ledger for an order',
  })
  async getOrderLedger(@Param('orderId') orderId: string) {
    return this.service.getOrderLedger(orderId);
  }
}
