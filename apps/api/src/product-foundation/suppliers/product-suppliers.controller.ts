import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductSuppliersService } from './product-suppliers.service';
import { LinkProductSupplierDto } from './link-supplier.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products/:productId/suppliers')
export class ProductSuppliersController {
  constructor(private readonly service: ProductSuppliersService) {}

  @Post()
  @ApiOperation({ summary: 'Link supplier business record to product' })
  async linkSupplier(
    @Param('productId') productId: string,
    @Body() dto: LinkProductSupplierDto,
  ) {
    return this.service.linkSupplier(productId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List suppliers linked to a product' })
  async getSuppliers(@Param('productId') productId: string) {
    return this.service.getSuppliers(productId);
  }
}
