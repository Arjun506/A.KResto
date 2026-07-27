import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SplitPaymentService } from './split-payments.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Split Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments/:id/splits')
export class SplitPaymentController {
  constructor(private readonly service: SplitPaymentService) {}

  @Post()
  @ApiOperation({
    summary:
      'Split total payment amount across multiple payment instruments (e.g. Card + GiftCard)',
  })
  async createSplit(
    @Param('id') id: string,
    @Body()
    body: {
      splits: Array<{
        tenderType: string;
        amount: number;
        referenceId?: string;
      }>;
    },
  ) {
    return this.service.createSplit(id, body.splits);
  }

  @Get()
  @ApiOperation({ summary: 'List split tenders for a payment transaction' })
  async getSplits(@Param('id') id: string) {
    return this.service.getSplits(id);
  }
}
