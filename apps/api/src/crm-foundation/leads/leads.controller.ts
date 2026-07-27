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
import { LeadsService } from './leads.service';
import { CreateCrmLeadDto } from './dto/create-lead.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('CRM Foundation — Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm-leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new CRM lead card with dynamic scoring reference',
  })
  async createLead(@Body() dto: CreateCrmLeadDto) {
    return this.service.createLead(dto);
  }

  @Post(':id/qualify')
  @ApiOperation({ summary: 'Qualify lead and link to customer profile ID' })
  async qualifyLead(
    @Param('id') id: string,
    @Body() body: { customerId: string },
  ) {
    return this.service.qualifyLead(id, body.customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get CRM lead details' })
  async getLead(@Param('id') id: string) {
    return this.service.getLead(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all CRM leads' })
  async listLeads(@Query('tenantId') tenantId?: string) {
    return this.service.listLeads(tenantId);
  }
}
