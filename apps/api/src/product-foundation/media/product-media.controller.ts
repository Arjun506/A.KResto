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
import { ProductMediaService } from './product-media.service';
import { AddProductMediaDto } from './add-media.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products/:productId/media')
export class ProductMediaController {
  constructor(private readonly service: ProductMediaService) {}

  @Post()
  @ApiOperation({
    summary: 'Add media asset to product (Image, Video, 3D Model, Spec Sheet)',
  })
  async addMedia(
    @Param('productId') productId: string,
    @Body() dto: AddProductMediaDto,
  ) {
    return this.service.addMedia(productId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List media assets for a product' })
  async getMedia(@Param('productId') productId: string) {
    return this.service.getMedia(productId);
  }

  @Delete(':mediaId')
  @ApiOperation({ summary: 'Soft delete media asset' })
  async softDeleteMedia(@Param('mediaId') mediaId: string) {
    return this.service.softDeleteMedia(mediaId);
  }
}
