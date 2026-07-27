import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SlaEngineService } from './sla-engine.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Workflow Foundation — SLA Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflow-slas')
export class SlaEngineController {
  constructor(private readonly service: SlaEngineService) {}

  @Post()
  @ApiOperation({
    summary: 'Configure SLA timing objectives for an operational entity',
  })
  async configureSla(
    @Body()
    body: {
      tenantId?: string;
      referenceType: string;
      referenceId: string;
      minutes: number;
    },
  ) {
    return this.service.configureSla(
      body.tenantId || 'GLOBAL',
      body.referenceType,
      body.referenceId,
      body.minutes,
    );
  }

  @Post('check')
  @ApiOperation({
    summary:
      'Trigger batch scan evaluating target completion breaches and dispatch escalations',
  })
  async checkSlas() {
    return this.service.checkBreachedSlas();
  }

  @Get()
  @ApiOperation({ summary: 'List SLAs' })
  async getSlas(@Query('tenantId') tenantId?: string) {
    return this.service.getSlas(tenantId);
  }
}
