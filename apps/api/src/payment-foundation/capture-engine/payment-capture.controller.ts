import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentCaptureService } from './payment-capture.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Capture Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments/:id/capture')
export class PaymentCaptureController {
  constructor(private readonly service: PaymentCaptureService) {}

  @Post()
  @ApiOperation({
    summary: 'Capture authorized funds (full or partial support)',
  })
  async capturePayment(
    @Param('id') id: string,
    @Body() body: { amount?: number },
  ) {
    return this.service.capturePayment(id, body.amount);
  }
}
