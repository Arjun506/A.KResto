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
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './create-warehouse.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Warehouses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly service: WarehousesService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new warehouse facility & hierarchy' })
  async createWarehouse(@Body() dto: CreateWarehouseDto) {
    return this.service.createWarehouse(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List warehouses' })
  async listWarehouses(@Query('tenantId') tenantId?: string) {
    return this.service.listWarehouses(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse details by ID' })
  async getWarehouseById(@Param('id') id: string) {
    return this.service.getWarehouseById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete warehouse facility' })
  async softDeleteWarehouse(@Param('id') id: string) {
    return this.service.softDeleteWarehouse(id);
  }
}
