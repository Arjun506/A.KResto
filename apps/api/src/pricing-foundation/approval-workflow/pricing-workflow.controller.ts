import { Controller, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PricingWorkflowService } from './pricing-workflow.service';
import { UpdatePricingWorkflowStatusDto } from './update-workflow-status.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Approval Workflow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('price-books/:priceBookId/workflow')
export class PricingWorkflowController {
  constructor(private readonly service: PricingWorkflowService) {}

  @Patch()
  @ApiOperation({
    summary:
      'Update price book approval workflow state (Draft, Submitted, Approved, Rejected, Published)',
  })
  async updateWorkflowStatus(
    @Param('priceBookId') priceBookId: string,
    @Body() dto: UpdatePricingWorkflowStatusDto,
  ) {
    return this.service.updateWorkflowStatus(priceBookId, dto);
  }
}
