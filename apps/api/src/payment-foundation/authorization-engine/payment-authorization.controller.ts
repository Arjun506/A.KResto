import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentAuthorizationService } from './payment-authorization.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Authorization Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments/:id/authorize')
export class PaymentAuthorizationController {
  constructor(private readonly service: PaymentAuthorizationService) {}

  @Post()
  @ApiOperation({
    summary: 'Authorize a registered payment transaction using card tokens',
  })
  async authorizePayment(
    @Param('id') id: string,
    @Body() body: { token: string },
  ) {
    return this.service.authorizePayment(id, body.token);
  }
}
