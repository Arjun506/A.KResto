import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CrmCasesService } from './crm-cases.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('CRM Foundation — Case Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm-cases')
export class CrmCasesController {
  constructor(private readonly service: CrmCasesService) {}

  @Post()
  @ApiOperation({
    summary:
      'Register customer case (complaint, inquiry, incident, escalation) separate from tickets',
  })
  async createCase(
    @Body()
    body: {
      tenantId?: string;
      customerId: string;
      caseType: string;
      title: string;
      description?: string;
    },
  ) {
    return this.service.createCase(
      body.tenantId || 'GLOBAL',
      body.customerId,
      body.caseType,
      body.title,
      body.description,
    );
  }

  @Post(':id/escalate')
  @ApiOperation({ summary: 'Escalate a customer case' })
  async escalateCase(@Param('id') id: string) {
    return this.service.escalateCase(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get case details' })
  async getCase(@Param('id') id: string) {
    return this.service.getCase(id);
  }
}
