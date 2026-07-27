import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderTagsService } from './order-tags.service';
import { TagOrderDto } from './tag-order.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Tags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/tags')
export class OrderTagsController {
  constructor(private readonly service: OrderTagsService) {}

  @Post()
  @ApiOperation({
    summary: 'Attach dynamic operational or priority tag to an order',
  })
  async tagOrder(@Param('orderId') orderId: string, @Body() dto: TagOrderDto) {
    return this.service.tagOrder(orderId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List tags for an order' })
  async getTags(@Param('orderId') orderId: string) {
    return this.service.getTags(orderId);
  }
}
