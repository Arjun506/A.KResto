import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PriceRulesService } from './price-rules.service';
import { CreatePriceRuleDto } from './create-price-rule.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Price Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('price-rules')
export class PriceRulesController {
  constructor(private readonly service: PriceRulesService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create conditional price rule (Percentage, Fixed, Markup, Formula)',
  })
  async createPriceRule(
    @Body() dto: CreatePriceRuleDto,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.createPriceRule(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List active price rules ordered by priority' })
  async listPriceRules(@Query('tenantId') tenantId?: string) {
    return this.service.listPriceRules(tenantId);
  }
}
