import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApprovalEngineService } from './approval-engine.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Workflow Foundation — Approvals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflow-approvals')
export class ApprovalEngineController {
  constructor(private readonly service: ApprovalEngineService) {}

  @Post()
  @ApiOperation({
    summary:
      'Register a manual approval request stage for orders, pricing or payments',
  })
  async requestApproval(
    @Body()
    body: {
      tenantId?: string;
      referenceType: string;
      referenceId: string;
      stepName: string;
      roleId?: string;
      userId?: string;
    },
  ) {
    return this.service.requestApproval(
      body.tenantId || 'GLOBAL',
      body.referenceType,
      body.referenceId,
      body.stepName,
      body.roleId,
      body.userId,
    );
  }

  @Post(':id/grant')
  @ApiOperation({ summary: 'Grant sign-off approval' })
  async grantApproval(
    @Param('id') id: string,
    @Body() body: { userId?: string; comments?: string },
  ) {
    return this.service.grantApproval(id, body.userId, body.comments);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject sign-off approval' })
  async rejectApproval(
    @Param('id') id: string,
    @Body() body: { userId?: string; comments?: string },
  ) {
    return this.service.rejectApproval(id, body.userId, body.comments);
  }

  @Get(':id/ai-recommendation')
  @ApiOperation({ summary: 'Get AI approver recommendations' })
  async getApproverRecommendation(@Param('id') id: string) {
    return this.service.getApproverRecommendation(id);
  }
}
