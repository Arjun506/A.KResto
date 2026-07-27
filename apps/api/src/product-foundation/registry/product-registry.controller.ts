import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductRegistryService } from './product-registry.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductRegistryController {
  constructor(private readonly service: ProductRegistryService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new enterprise product record in catalog master',
  })
  async createProduct(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.service.createProduct(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List products with pagination & tenant isolation' })
  async listProducts(
    @Query('tenantId') tenantId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.service.listProducts(tenantId, Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed product record by ID' })
  async getProductById(@Param('id') id: string) {
    return this.service.getProductById(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update product status (Active, Suspended, Archived)',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProductStatusDto,
    @Req() req: any,
  ) {
    return this.service.updateStatus(id, dto.status, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete product record' })
  async softDeleteProduct(@Param('id') id: string, @Req() req: any) {
    return this.service.softDeleteProduct(id, req.user?.id);
  }
}
