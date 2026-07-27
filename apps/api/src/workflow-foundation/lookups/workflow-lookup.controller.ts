import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Workflow Foundation — Reference Lookups')
@PublicTenant()
@Controller('workflow-lookups')
export class WorkflowLookupController {
  @Get('workflow-statuses')
  @ApiOperation({ summary: 'Get workflow lifecycle status states' })
  getWorkflowStatuses() {
    return ['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED'].map((code) => ({
      code,
      label: code,
    }));
  }

  @Get('instance-statuses')
  @ApiOperation({ summary: 'Get instance states' })
  getInstanceStatuses() {
    return ['RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'].map((code) => ({
      code,
      label: code,
    }));
  }

  @Get('approval-statuses')
  @ApiOperation({ summary: 'Get approval levels status codes' })
  getApprovalStatuses() {
    return ['PENDING', 'APPROVED', 'REJECTED'].map((code) => ({
      code,
      label: code,
    }));
  }
}
