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
import { ProductRelationshipsService } from './product-relationships.service';
import { CreateProductRelationshipDto } from './create-relationship.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Relationships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products/:productId/relationships')
export class ProductRelationshipsController {
  constructor(private readonly service: ProductRelationshipsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create inter-product relationship (Related, Similar, Cross-sell, Up-sell, Accessory, Replacement)',
  })
  async createRelationship(
    @Param('productId') productId: string,
    @Body() dto: CreateProductRelationshipDto,
  ) {
    return this.service.createRelationship(productId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get active relationships for a product' })
  async getRelationships(@Param('productId') productId: string) {
    return this.service.getRelationships(productId);
  }

  @Delete(':relationshipId')
  @ApiOperation({ summary: 'Remove product relationship link' })
  async removeRelationship(@Param('relationshipId') relationshipId: string) {
    return this.service.removeRelationship(relationshipId);
  }
}
