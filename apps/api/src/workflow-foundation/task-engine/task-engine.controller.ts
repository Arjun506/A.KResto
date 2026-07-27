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
import { TaskEngineService } from './task-engine.service';
import { CreateWorkflowTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Workflow Foundation — Task Inbox')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflow-tasks')
export class TaskEngineController {
  constructor(private readonly service: TaskEngineService) {}

  @Post()
  @ApiOperation({
    summary:
      'Register a manual task in the human inbox queue with dynamic form bindings',
  })
  async createTask(@Body() dto: CreateWorkflowTaskDto) {
    return this.service.createTask(dto);
  }

  @Post(':id/delegate')
  @ApiOperation({
    summary: 'Delegate human task ownership to another employee',
  })
  async delegateTask(
    @Param('id') id: string,
    @Body() body: { delegatedTo: string },
  ) {
    return this.service.delegateTask(id, body.delegatedTo);
  }

  @Post(':id/complete')
  @ApiOperation({
    summary: 'Complete a manual task and release downstream workflow triggers',
  })
  async completeTask(@Param('id') id: string) {
    return this.service.completeTask(id);
  }

  @Get('inbox/:userId')
  @ApiOperation({
    summary:
      'Retrieve human task inbox listing (Assigned, Delegated, Team Queue)',
  })
  async getUserInbox(@Param('userId') userId: string) {
    return this.service.getUserInbox(userId);
  }
}
