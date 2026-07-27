import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TokenVaultService } from './payment-tokens.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Token Vault')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-tokens')
export class PaymentTokensController {
  constructor(private readonly service: TokenVaultService) {}

  @Post()
  @ApiOperation({
    summary: 'Tokenize card details securely (mock secure vault support)',
  })
  async tokenizeCard(
    @Body()
    body: {
      customerId: string;
      cardBrand: string;
      lastFour: string;
      expiryMonth: number;
      expiryYear: number;
    },
  ) {
    return this.service.tokenizeCard(
      body.customerId,
      body.cardBrand,
      body.lastFour,
      body.expiryMonth,
      body.expiryYear,
    );
  }

  @Post(':id/rotate')
  @ApiOperation({
    summary:
      'Rotate payment token manually or as part of schedule rotation policy',
  })
  async rotateToken(@Param('id') id: string) {
    return this.service.rotateToken(id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'List vault tokens for a customer' })
  async getCustomerTokens(@Param('customerId') customerId: string) {
    return this.service.getCustomerTokens(customerId);
  }
}
