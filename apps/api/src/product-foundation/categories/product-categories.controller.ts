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
import { ProductCategoriesService } from './product-categories.service';
import {
  CreateProductCategoryDto,
  AssignProductCategoryDto,
} from './create-category.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly service: ProductCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create product category node in taxonomy tree' })
  async createCategory(
    @Body() dto: CreateProductCategoryDto,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.createCategory(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get multi-level product category tree' })
  async getCategoryTree(@Query('tenantId') tenantId?: string) {
    return this.service.getCategoryTree(tenantId);
  }

  @Post(':productId/assign')
  @ApiOperation({ summary: 'Assign category to product' })
  async assignCategory(
    @Param('productId') productId: string,
    @Body() dto: AssignProductCategoryDto,
  ) {
    return this.service.assignCategory(productId, dto);
  }
}
