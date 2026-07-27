import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  PaymentMethodType,
  PaymentTransactionStatus,
  SettlementStatus,
} from '@prisma/client';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Payment Foundation — Lookups')
@PublicTenant()
@Controller('payment-lookups')
export class PaymentLookupController {
  @Get('methods')
  @ApiOperation({ summary: 'Get payment method types' })
  getMethods() {
    return Object.values(PaymentMethodType).map((code) => ({
      code,
      label: code,
    }));
  }

  @Get('statuses')
  @ApiOperation({ summary: 'Get payment transaction statuses' })
  getStatuses() {
    return Object.values(PaymentTransactionStatus).map((code) => ({
      code,
      label: code,
    }));
  }

  @Get('settlement-statuses')
  @ApiOperation({ summary: 'Get settlement batch statuses' })
  getSettlementStatuses() {
    return Object.values(SettlementStatus).map((code) => ({
      code,
      label: code,
    }));
  }
}
