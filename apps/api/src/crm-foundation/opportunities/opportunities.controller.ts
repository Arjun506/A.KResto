import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OpportunitiesService } from './opportunities.service';
import { CreateCrmOpportunityDto } from './dto/create-opportunity.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('CRM Foundation — Opportunities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm-opportunities')
export class OpportunitiesController {
  constructor(private readonly service: OpportunitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sales/transaction deal opportunity' })
  async createOpportunity(@Body() dto: CreateCrmOpportunityDto) {
    return this.service.createOpportunity(dto);
  }

  @Patch(':id/stage')
  @ApiOperation({
    summary: 'Advance sales pipeline stage and adjust conversion probabilities',
  })
  async updateStage(
    @Param('id') id: string,
    @Body() body: { stage: string; probability?: number },
  ) {
    return this.service.updateStage(id, body.stage, body.probability);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get opportunity details' })
  async getOpportunity(@Param('id') id: string) {
    return this.service.getOpportunity(id);
  }

  @Get()
  @ApiOperation({ summary: 'List opportunities' })
  async listOpportunities(@Query('tenantId') tenantId?: string) {
    return this.service.listOpportunities(tenantId);
  }
}
