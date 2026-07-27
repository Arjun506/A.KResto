import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderApprovalWorkflowService } from './order-approval-workflow.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Approval Workflow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/approval')
export class OrderApprovalWorkflowController {
  constructor(private readonly service: OrderApprovalWorkflowService) {}

  @Post('approve')
  @ApiOperation({
    summary: 'Approve order (for high-value or discount threshold checks)',
  })
  async approveOrder(@Param('orderId') orderId: string, @Req() req: any) {
    return this.service.approveOrder(orderId, req.user?.id);
  }

  @Post('reject')
  @ApiOperation({ summary: 'Reject order approval' })
  async rejectOrder(
    @Param('orderId') orderId: string,
    @Body() body: { reason?: string },
    @Req() req: any,
  ) {
    return this.service.rejectOrder(orderId, body.reason, req.user?.id);
  }
}
