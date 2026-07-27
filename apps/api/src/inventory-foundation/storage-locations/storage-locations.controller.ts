import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StorageLocationsService } from './storage-locations.service';
import { CreateStorageLocationDto } from './create-location.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Storage Locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('storage-locations')
export class StorageLocationsController {
  constructor(private readonly service: StorageLocationsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create internal warehouse storage location (Aisle/Rack/Shelf/Bin)',
  })
  async createLocation(@Body() dto: CreateStorageLocationDto) {
    return this.service.createLocation(dto);
  }

  @Get(':warehouseId')
  @ApiOperation({ summary: 'List storage locations in a warehouse' })
  async listLocations(@Param('warehouseId') warehouseId: string) {
    return this.service.listLocations(warehouseId);
  }
}
