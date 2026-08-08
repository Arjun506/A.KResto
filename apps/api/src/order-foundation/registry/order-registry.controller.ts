import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderRegistryService } from './order-registry.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order-foundation/orders')
export class OrderRegistryController {
  constructor(private readonly service: OrderRegistryService) {}

  @Post()
  @ApiOperation({
    summary: 'Register a new master commercial order record with line items',
  })
  async createOrder(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.service.createOrder(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List orders with pagination & tenant isolation' })
  async listOrders(
    @Query('tenantId') tenantId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.service.listOrders(tenantId, Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed order record by ID' })
  async getOrderById(@Param('id') id: string) {
    return this.service.getOrderById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete order record' })
  async softDeleteOrder(@Param('id') id: string, @Req() req: any) {
    return this.service.softDeleteOrder(id, req.user?.id);
  }
}
