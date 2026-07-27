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
import { PaymentDisputesService } from './payment-disputes.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Disputes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-disputes')
export class PaymentDisputesController {
  constructor(private readonly service: PaymentDisputesService) {}

  @Post()
  @ApiOperation({ summary: 'Open a payment chargeback/dispute case' })
  async openDispute(
    @Body()
    body: {
      paymentTransactionId: string;
      disputeNumber: string;
      reason: string;
      amount: number;
    },
  ) {
    return this.service.openDispute(
      body.paymentTransactionId,
      body.disputeNumber,
      body.reason,
      body.amount,
    );
  }

  @Post(':id/evidence')
  @ApiOperation({
    summary: 'Submit document proof/evidence urls to the dispute file',
  })
  async uploadEvidence(
    @Param('id') id: string,
    @Body() body: { urls: string[] },
  ) {
    return this.service.uploadEvidence(id, body.urls);
  }

  @Post(':id/resolve')
  @ApiOperation({
    summary: 'Resolve the dispute and record arbitration result (Won / Lost)',
  })
  async resolveDispute(
    @Param('id') id: string,
    @Body() body: { result: 'WON' | 'LOST' },
  ) {
    return this.service.resolveDispute(id, body.result);
  }

  @Get()
  @ApiOperation({ summary: 'List chargeback cases' })
  async getDisputes(
    @Query('paymentTransactionId') paymentTransactionId?: string,
  ) {
    return this.service.getDisputes(paymentTransactionId);
  }
}
