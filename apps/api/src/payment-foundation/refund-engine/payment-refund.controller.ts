import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentRefundService } from './payment-refund.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Refund Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments/:id/refund')
export class PaymentRefundController {
  constructor(private readonly service: PaymentRefundService) {}

  @Post()
  @ApiOperation({ summary: 'Submit refund request (full or partial support)' })
  async refundPayment(
    @Param('id') id: string,
    @Body() body: { amount: number; reasonCode: string; notes?: string },
  ) {
    return this.service.refundPayment(
      id,
      body.amount,
      body.reasonCode,
      body.notes,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List refunds for a payment transaction' })
  async getRefunds(@Param('id') id: string) {
    return this.service.getRefunds(id);
  }
}
