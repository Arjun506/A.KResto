import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SerialManagementService } from './serial-management.service';
import { AssignSerialDto } from './assign-serial.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Serial Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory-serials')
export class SerialManagementController {
  constructor(private readonly service: SerialManagementService) {}

  @Post()
  @ApiOperation({
    summary: 'Assign unique serial number to individual item unit',
  })
  async assignSerial(@Body() dto: AssignSerialDto) {
    return this.service.assignSerial(dto);
  }

  @Get(':inventoryItemId')
  @ApiOperation({
    summary: 'List tracked serial numbers for an inventory item',
  })
  async getSerials(@Param('inventoryItemId') inventoryItemId: string) {
    return this.service.getSerials(inventoryItemId);
  }
}
