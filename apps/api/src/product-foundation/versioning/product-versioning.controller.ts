import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductVersioningService } from './product-versioning.service';
import { CreateProductVersionDto } from './create-version.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Versioning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products/:productId/versions')
export class ProductVersioningController {
  constructor(private readonly service: ProductVersioningService) {}

  @Post()
  @ApiOperation({ summary: 'Create version snapshot of product state' })
  async createVersionSnapshot(
    @Param('productId') productId: string,
    @Body() dto: CreateProductVersionDto,
    @Req() req: any,
  ) {
    return this.service.createVersionSnapshot(productId, dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get version history for a product' })
  async getVersions(@Param('productId') productId: string) {
    return this.service.getVersions(productId);
  }

  @Post(':versionId/rollback')
  @ApiOperation({ summary: 'Rollback product to a previous version snapshot' })
  async rollbackToVersion(
    @Param('productId') productId: string,
    @Param('versionId') versionId: string,
    @Req() req: any,
  ) {
    return this.service.rollbackToVersion(productId, versionId, req.user?.id);
  }
}
