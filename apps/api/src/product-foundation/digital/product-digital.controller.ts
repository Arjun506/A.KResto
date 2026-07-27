import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductDigitalService } from './product-digital.service';
import { CreateDigitalAssetDto } from './create-digital-asset.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Digital Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products/:productId/digital-assets')
export class ProductDigitalController {
  constructor(private readonly service: ProductDigitalService) {}

  @Post()
  @ApiOperation({
    summary: 'Register downloadable digital asset & license key requirements',
  })
  async addDigitalAsset(
    @Param('productId') productId: string,
    @Body() dto: CreateDigitalAssetDto,
  ) {
    return this.service.addDigitalAsset(productId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List digital assets for a product' })
  async getDigitalAssets(@Param('productId') productId: string) {
    return this.service.getDigitalAssets(productId);
  }
}
