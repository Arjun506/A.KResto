import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { ProductCapabilityService } from './product-capability.service';
import {
  CreateProductDto,
  ListProductsQueryDto,
  PublishProductDto,
  UpdateProductDto,
} from './dto';

@Controller('product-capability')
export class ProductCapabilityController {
  constructor(private readonly service: ProductCapabilityService) {}

  @Get('manifest')
  getManifest() {
    return this.service.getProductManifest();
  }

  @Get('products')
  list(@Query() query: ListProductsQueryDto) {
    return this.service.listProducts();
  }

  @Get('products/:id')
  getById(@Param('id') id: string) {
    return this.service.getProductById(id);
  }

  @Post('products')
  create(@Body() dto: CreateProductDto) {
    return this.service.createProduct(dto);
  }

  @Put('products/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.updateProduct(id, dto);
  }

  @Post('products/:id/publish')
  publish(@Param('id') id: string, @Body() dto: PublishProductDto) {
    return this.service.publishProduct(id, dto);
  }
}
