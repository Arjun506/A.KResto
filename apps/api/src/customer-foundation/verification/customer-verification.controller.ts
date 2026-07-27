import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerVerificationService } from './customer-verification.service';
import {
  RequestVerificationDto,
  ConfirmVerificationDto,
} from './verify-channel.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Customer Foundation — Verification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers/:customerId/verification')
export class CustomerVerificationController {
  constructor(private readonly service: CustomerVerificationService) {}

  @Post('request')
  @ApiOperation({
    summary: 'Request OTP verification token for Email or SMS channel',
  })
  async requestVerification(
    @Param('customerId') customerId: string,
    @Body() dto: RequestVerificationDto,
  ) {
    return this.service.requestVerification(customerId, dto);
  }

  @Post('confirm')
  @ApiOperation({
    summary: 'Confirm OTP verification token for Email or SMS channel',
  })
  async confirmVerification(
    @Param('customerId') customerId: string,
    @Body() dto: ConfirmVerificationDto,
  ) {
    return this.service.confirmVerification(customerId, dto);
  }
}
