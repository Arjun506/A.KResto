import { Controller, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FulfillmentExecutionService } from './fulfillment-execution.service';
import { UpdateFulfillmentDto } from './update-fulfillment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Fulfillment Execution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/fulfillment')
export class FulfillmentExecutionController {
  constructor(private readonly service: FulfillmentExecutionService) {}

  @Patch()
  @ApiOperation({
    summary:
      'Update order fulfillment status (Unfulfilled, Partially Fulfilled, Fulfilled, Returned)',
  })
  async updateFulfillmentStatus(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateFulfillmentDto,
  ) {
    return this.service.updateFulfillmentStatus(orderId, dto);
  }
}
