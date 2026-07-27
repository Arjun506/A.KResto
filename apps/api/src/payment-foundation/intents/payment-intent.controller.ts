import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentIntentService } from './payment-intent.service';
import { CreatePaymentIntentDto } from './dto/create-intent.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Intents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-intents')
export class PaymentIntentController {
  constructor(private readonly service: PaymentIntentService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a payment intent to separate intent creation from execution',
  })
  async createIntent(@Body() dto: CreatePaymentIntentDto) {
    return this.service.createIntent(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a payment intent' })
  async getIntent(@Param('id') id: string) {
    return this.service.getIntent(id);
  }

  @Post(':id/expire')
  @ApiOperation({ summary: 'Manually expire an unused payment intent' })
  async expireIntent(@Param('id') id: string) {
    return this.service.expireIntent(id);
  }
}
