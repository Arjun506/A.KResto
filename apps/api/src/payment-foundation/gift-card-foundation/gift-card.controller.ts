import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GiftCardService } from './gift-card.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Gift Cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gift-cards')
export class GiftCardController {
  constructor(private readonly service: GiftCardService) {}

  @Post()
  @ApiOperation({
    summary:
      'Issue new gift card with custom initial balance & pin verification code',
  })
  async issueGiftCard(
    @Body()
    body: {
      tenantId?: string;
      cardNumber: string;
      initialBalance: number;
      pin?: string;
    },
  ) {
    return this.service.issueGiftCard(
      body.tenantId || 'GLOBAL',
      body.cardNumber,
      body.initialBalance,
      body.pin,
    );
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Validate & redeem gift card balance' })
  async redeemGiftCard(
    @Body() body: { cardNumber: string; amount: number; pin?: string },
  ) {
    return this.service.redeemGiftCard(body.cardNumber, body.amount, body.pin);
  }

  @Get(':cardNumber')
  @ApiOperation({
    summary: 'Query gift card activation state & balance details',
  })
  async getGiftCard(@Param('cardNumber') cardNumber: string) {
    return this.service.getGiftCard(cardNumber);
  }
}
