import { Controller, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductPublishingService } from './product-publishing.service';
import { UpdatePublishingStatusDto } from './update-publishing-status.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Publishing Workflow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products/:productId/publishing')
export class ProductPublishingController {
  constructor(private readonly service: ProductPublishingService) {}

  @Patch()
  @ApiOperation({
    summary:
      'Update publishing workflow state (Draft, Review, Approved, Published, Archived)',
  })
  async updatePublishingStatus(
    @Param('productId') productId: string,
    @Body() dto: UpdatePublishingStatusDto,
    @Req() req: any,
  ) {
    return this.service.updatePublishingStatus(productId, dto, req.user?.id);
  }
}
