import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PricingFormulaService } from './pricing-formula.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

export class EvaluateFormulaDto {
  expression: string;
  variables: Record<string, number>;
}

@ApiTags('Pricing Foundation — Formula Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pricing/formulas')
export class PricingFormulaController {
  constructor(private readonly service: PricingFormulaService) {}

  @Post('evaluate')
  @ApiOperation({
    summary:
      'Evaluate dynamic pricing formula expression (E.G. "basePrice * 1.15 + fee")',
  })
  async evaluateFormula(@Body() dto: EvaluateFormulaDto) {
    const result = this.service.evaluateFormula(dto.expression, dto.variables);
    return { expression: dto.expression, variables: dto.variables, result };
  }
}
