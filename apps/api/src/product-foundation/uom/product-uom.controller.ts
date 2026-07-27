import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductUomService } from './product-uom.service';
import { CreateProductUomDto } from './create-uom.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Units of Measure (UOM)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product-uom')
export class ProductUomController {
  constructor(private readonly service: ProductUomService) {}

  @Post()
  @ApiOperation({
    summary: 'Create unit of measure (Unit, Kg, Meter, Hour, Pack, Box)',
  })
  async createUom(
    @Body() dto: CreateProductUomDto,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.createUom(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List supported units of measure' })
  async listUoms(@Query('tenantId') tenantId?: string) {
    return this.service.listUoms(tenantId);
  }
}
