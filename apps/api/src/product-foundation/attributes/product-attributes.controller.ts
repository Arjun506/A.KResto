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
import { ProductAttributesService } from './product-attributes.service';
import {
  CreateProductAttributeDto,
  SetAttributeValueDto,
} from './create-attribute.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Attributes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product-attributes')
export class ProductAttributesController {
  constructor(private readonly service: ProductAttributesService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create global product attribute definition (Color, Size, Material, Voltage)',
  })
  async createAttribute(
    @Body() dto: CreateProductAttributeDto,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.createAttribute(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List available product attributes' })
  async listAttributes(@Query('tenantId') tenantId?: string) {
    return this.service.listAttributes(tenantId);
  }

  @Post(':productId/values')
  @ApiOperation({ summary: 'Set attribute value for a product' })
  async setAttributeValue(
    @Param('productId') productId: string,
    @Body() dto: SetAttributeValueDto,
  ) {
    return this.service.setAttributeValue(productId, dto);
  }
}
