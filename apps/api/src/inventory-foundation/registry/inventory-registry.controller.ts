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
import { InventoryRegistryService } from './inventory-registry.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory-items')
export class InventoryRegistryController {
  constructor(private readonly service: InventoryRegistryService) {}

  @Post()
  @ApiOperation({
    summary: 'Register a new master stock inventory item definition',
  })
  async createInventoryItem(
    @Body() dto: CreateInventoryItemDto,
    @Req() req: any,
  ) {
    return this.service.createInventoryItem(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({
    summary: 'List inventory items with pagination & tenant isolation',
  })
  async listInventoryItems(
    @Query('tenantId') tenantId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.service.listInventoryItems(
      tenantId,
      Number(page),
      Number(limit),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed inventory item record by ID' })
  async getInventoryItemById(@Param('id') id: string) {
    return this.service.getInventoryItemById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete inventory item definition' })
  async softDeleteInventoryItem(@Param('id') id: string, @Req() req: any) {
    return this.service.softDeleteInventoryItem(id, req.user?.id);
  }
}
