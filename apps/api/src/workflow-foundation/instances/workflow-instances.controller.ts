import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowInstancesService } from './workflow-instances.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Workflow Foundation — Instances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflow-instances')
export class WorkflowInstancesController {
  constructor(private readonly service: WorkflowInstancesService) {}

  @Post()
  @ApiOperation({
    summary: 'Instantiate and begin executing a workflow definition template',
  })
  async startInstance(
    @Body()
    body: {
      workflowDefinitionId: string;
      variables?: any;
      tenantId?: string;
    },
  ) {
    return this.service.startInstance(
      body.workflowDefinitionId,
      body.variables || {},
      body.tenantId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Get details of an active workflow instance and variable state scopes',
  })
  async getInstance(@Param('id') id: string) {
    return this.service.getInstance(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel/terminate a running workflow instance' })
  async cancelInstance(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.service.cancelInstance(id, body.reason);
  }
}
