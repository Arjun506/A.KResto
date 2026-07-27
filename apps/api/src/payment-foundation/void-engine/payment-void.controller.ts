import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentVoidService } from './payment-void.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Void Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments/:id/void')
export class PaymentVoidController {
  constructor(private readonly service: PaymentVoidService) {}

  @Post()
  @ApiOperation({ summary: 'Void payment authorization hold before capture' })
  async voidPayment(@Param('id') id: string) {
    return this.service.voidPayment(id);
  }
}
