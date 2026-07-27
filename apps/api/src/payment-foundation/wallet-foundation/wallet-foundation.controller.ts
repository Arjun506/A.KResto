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
import { WalletFoundationService } from './wallet-foundation.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Wallet Foundation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletFoundationController {
  constructor(private readonly service: WalletFoundationService) {}

  @Post('credit')
  @ApiOperation({ summary: 'Credit funds to customer digital wallet' })
  async creditWallet(
    @Body()
    body: {
      customerId: string;
      amount: number;
      currency?: string;
      refType?: string;
      refId?: string;
    },
  ) {
    return this.service.creditWallet(
      body.customerId,
      body.amount,
      body.currency,
      body.refType,
      body.refId,
    );
  }

  @Post('debit')
  @ApiOperation({ summary: 'Debit funds from customer digital wallet' })
  async debitWallet(
    @Body()
    body: {
      customerId: string;
      amount: number;
      currency?: string;
      refType?: string;
      refId?: string;
    },
  ) {
    return this.service.debitWallet(
      body.customerId,
      body.amount,
      body.currency,
      body.refType,
      body.refId,
    );
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get digital wallet balance & ledger records' })
  async getWallet(
    @Param('customerId') customerId: string,
    @Query('currency') currency?: string,
  ) {
    return this.service.getWallet(customerId, currency);
  }
}
