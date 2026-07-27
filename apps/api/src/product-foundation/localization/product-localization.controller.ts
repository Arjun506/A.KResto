import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductLocalizationService } from './product-localization.service';
import { UpdateProductTranslationDto } from './update-translation.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Localization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products/:productId/translations')
export class ProductLocalizationController {
  constructor(private readonly service: ProductLocalizationService) {}

  @Patch()
  @ApiOperation({
    summary:
      'Upsert multi-language product name, descriptions, and SEO translations',
  })
  async updateTranslation(
    @Param('productId') productId: string,
    @Body() dto: UpdateProductTranslationDto,
  ) {
    return this.service.updateTranslation(productId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active language translations for a product',
  })
  async getTranslations(@Param('productId') productId: string) {
    return this.service.getTranslations(productId);
  }
}
