import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductComplianceService } from './product-compliance.service';
import { CreateComplianceDto } from './create-compliance.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products/:productId/compliance')
export class ProductComplianceController {
  constructor(private readonly service: ProductComplianceService) {}

  @Post()
  @ApiOperation({
    summary:
      'Register product regulatory compliance, SDS, or country restriction',
  })
  async addComplianceRecord(
    @Param('productId') productId: string,
    @Body() dto: CreateComplianceDto,
  ) {
    return this.service.addComplianceRecord(productId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List compliance records for a product' })
  async getComplianceRecords(@Param('productId') productId: string) {
    return this.service.getComplianceRecords(productId);
  }
}
