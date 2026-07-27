import { Controller, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MovementWorkflowService } from './movement-workflow.service';
import { UpdateMovementWorkflowDto } from './update-movement-workflow.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Approval Workflow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock-movements/:movementId/workflow')
export class MovementWorkflowController {
  constructor(private readonly service: MovementWorkflowService) {}

  @Patch()
  @ApiOperation({
    summary:
      'Update stock movement workflow state (Draft, Submitted, Approved, Rejected, Posted)',
  })
  async updateWorkflowStatus(
    @Param('movementId') movementId: string,
    @Body() dto: UpdateMovementWorkflowDto,
  ) {
    return this.service.updateWorkflowStatus(movementId, dto);
  }
}
