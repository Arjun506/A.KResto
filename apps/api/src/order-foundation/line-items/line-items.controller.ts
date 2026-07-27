import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LineItemsService } from './line-items.service';
import { AddLineItemDto } from './add-line-item.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Line Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/items')
export class LineItemsController {
  constructor(private readonly service: LineItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new line item to an existing order' })
  async addLineItem(
    @Param('orderId') orderId: string,
    @Body() dto: AddLineItemDto,
  ) {
    return this.service.addLineItem(orderId, dto);
  }
}
