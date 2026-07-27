import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReturnsRefundsService } from './returns-refunds.service';
import { CreateReturnAuthDto } from './create-return.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Returns & Refunds')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/returns')
export class ReturnsRefundsController {
  constructor(private readonly service: ReturnsRefundsService) {}

  @Post()
  @ApiOperation({
    summary: 'Authorize order return (RMA) and generate refund request',
  })
  async authorizeReturn(
    @Param('orderId') orderId: string,
    @Body() dto: CreateReturnAuthDto,
  ) {
    return this.service.authorizeReturn(orderId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List returns and refund requests for an order' })
  async getReturns(@Param('orderId') orderId: string) {
    return this.service.getReturns(orderId);
  }
}
