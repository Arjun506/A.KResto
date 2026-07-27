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
import { ProductBundlesService } from './product-bundles.service';
import { CreateProductBundleDto } from './create-bundle.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Bundles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products/:parentProductId/bundles')
export class ProductBundlesController {
  constructor(private readonly service: ProductBundlesService) {}

  @Post()
  @ApiOperation({ summary: 'Add component product to bundle / kit assembly' })
  async addBundleComponent(
    @Param('parentProductId') parentProductId: string,
    @Body() dto: CreateProductBundleDto,
  ) {
    return this.service.addBundleComponent(parentProductId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get bundle components for a parent product' })
  async getBundleComponents(@Param('parentProductId') parentProductId: string) {
    return this.service.getBundleComponents(parentProductId);
  }

  @Delete(':bundleId')
  @ApiOperation({ summary: 'Remove component from product bundle' })
  async removeBundleComponent(@Param('bundleId') bundleId: string) {
    return this.service.removeBundleComponent(bundleId);
  }
}
