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
import { FraudRiskService } from './fraud-risk.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Fraud Risk')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments/:id/fraud-check')
export class FraudRiskController {
  constructor(private readonly service: FraudRiskService) {}

  @Post()
  @ApiOperation({
    summary:
      'Run rules-based fraud check on transaction (IP, BIN, amount triggers)',
  })
  async performCheck(
    @Param('id') id: string,
    @Body() body: { amount: number; ipAddress?: string },
  ) {
    return this.service.performFraudCheck(id, body.amount, body.ipAddress);
  }

  @Get()
  @ApiOperation({
    summary: 'Get historical fraud checks for a payment transaction',
  })
  async getChecks(@Param('id') id: string) {
    return this.service.getFraudChecks(id);
  }
}
