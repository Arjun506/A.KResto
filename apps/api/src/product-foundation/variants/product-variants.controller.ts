import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductVariantsService } from './product-variants.service';
import { CreateProductVariantDto } from './create-variant.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Variants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products/:productId/variants')
export class ProductVariantsController {
  constructor(private readonly service: ProductVariantsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create SKU variant for product (Color, Size, Option combinations)',
  })
  async createVariant(
    @Param('productId') productId: string,
    @Body() dto: CreateProductVariantDto,
  ) {
    return this.service.createVariant(productId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active variants for a product' })
  async getVariants(@Param('productId') productId: string) {
    return this.service.getVariants(productId);
  }

  @Delete(':variantId')
  @ApiOperation({ summary: 'Soft delete product variant' })
  async softDeleteVariant(@Param('variantId') variantId: string) {
    return this.service.softDeleteVariant(variantId);
  }
}
