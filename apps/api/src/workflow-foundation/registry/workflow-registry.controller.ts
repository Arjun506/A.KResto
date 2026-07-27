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
import { WorkflowRegistryService } from './workflow-registry.service';
import { CreateWorkflowDefinitionDto } from './dto/create-workflow.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Workflow Foundation — Registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowRegistryController {
  constructor(private readonly service: WorkflowRegistryService) {}

  @Post()
  @ApiOperation({
    summary:
      'Register a new workflow definition with designer nodes, connections, and canvas metadata',
  })
  async createDefinition(@Body() dto: CreateWorkflowDefinitionDto) {
    return this.service.createDefinition(dto);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a draft workflow definition version' })
  async publishDefinition(@Param('id') id: string) {
    return this.service.publishDefinition(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a workflow definition version' })
  async getDefinition(@Param('id') id: string) {
    return this.service.getDefinition(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all workflow definitions' })
  async listDefinitions(@Query('tenantId') tenantId?: string) {
    return this.service.listDefinitions(tenantId);
  }
}
