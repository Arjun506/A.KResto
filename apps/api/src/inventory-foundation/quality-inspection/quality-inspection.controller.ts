import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QualityInspectionService } from './quality-inspection.service';
import { CreateQualityInspectionDto } from './create-inspection.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Quality Inspection')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory/inspections')
export class QualityInspectionController {
  constructor(private readonly service: QualityInspectionService) {}

  @Post()
  @ApiOperation({
    summary: 'Record incoming/outgoing quality inspection result',
  })
  async createInspection(
    @Body() dto: CreateQualityInspectionDto,
    @Req() req: any,
  ) {
    return this.service.createInspection(dto, req.user?.id);
  }

  @Get(':inventoryItemId')
  @ApiOperation({ summary: 'List inspection logs for an inventory item' })
  async getInspections(@Param('inventoryItemId') inventoryItemId: string) {
    return this.service.getInspections(inventoryItemId);
  }
}
