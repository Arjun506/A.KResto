import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductTagsService } from './product-tags.service';
import { CreateProductTagDto, AssignProductTagDto } from './create-tag.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Tags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product-tags')
export class ProductTagsController {
  constructor(private readonly service: ProductTagsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create dynamic product tag (Featured, BestSeller, Clearance)',
  })
  async createTag(
    @Body() dto: CreateProductTagDto,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.service.createTag(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List catalog tags' })
  async listTags(@Query('tenantId') tenantId?: string) {
    return this.service.listTags(tenantId);
  }

  @Post(':productId/assign')
  @ApiOperation({ summary: 'Assign tag to product' })
  async assignTag(
    @Param('productId') productId: string,
    @Body() dto: AssignProductTagDto,
  ) {
    return this.service.assignTag(productId, dto);
  }

  @Delete(':productId/unassign/:tagId')
  @ApiOperation({ summary: 'Remove tag from product' })
  async unassignTag(
    @Param('productId') productId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.service.unassignTag(productId, tagId);
  }
}
