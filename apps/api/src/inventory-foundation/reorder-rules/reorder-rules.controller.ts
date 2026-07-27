import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReorderRulesService } from './reorder-rules.service';
import { SetReorderRuleDto } from './set-reorder-rule.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Reorder Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory-reorder-rules')
export class ReorderRulesController {
  constructor(private readonly service: ReorderRulesService) {}

  @Post()
  @ApiOperation({
    summary:
      'Set automated reorder point (ROP), safety stock, and reorder quantities',
  })
  async setReorderRule(@Body() dto: SetReorderRuleDto) {
    return this.service.setReorderRule(dto);
  }
}
