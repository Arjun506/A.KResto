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
import { PaymentSettlementService } from './payment-settlement.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Settlement Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-settlements')
export class PaymentSettlementController {
  constructor(private readonly service: PaymentSettlementService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new gross/fee/net merchant settlement batch (Draft)',
  })
  async createSettlementBatch(
    @Body()
    body: {
      tenantId?: string;
      businessId: string;
      gross: number;
      fee: number;
    },
  ) {
    return this.service.createSettlementBatch(
      body.tenantId || 'GLOBAL',
      body.businessId,
      body.gross,
      body.fee,
    );
  }

  @Post(':id/settle')
  @ApiOperation({
    summary: 'Publish settlement and record gateway payout execution',
  })
  async markSettled(@Param('id') id: string) {
    return this.service.markSettled(id);
  }

  @Get()
  @ApiOperation({ summary: 'List settlements for a merchant business unit' })
  async getSettlements(@Query('businessId') businessId?: string) {
    return this.service.getSettlements(businessId);
  }
}
