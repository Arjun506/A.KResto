import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InventoryLookupService } from './inventory-lookup.service';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Inventory Foundation — Reference Lookups')
@PublicTenant()
@Controller('inventory-lookups')
export class InventoryLookupController {
  constructor(private readonly service: InventoryLookupService) {}

  @Get('warehouse-types')
  @ApiOperation({ summary: 'Get warehouse facility types' })
  getWarehouseTypes() {
    return this.service.getWarehouseTypes();
  }

  @Get('valuation-methods')
  @ApiOperation({ summary: 'Get financial inventory valuation methods' })
  getValuationMethods() {
    return this.service.getValuationMethods();
  }

  @Get('movement-types')
  @ApiOperation({ summary: 'Get stock movement types' })
  getStockMovementTypes() {
    return this.service.getStockMovementTypes();
  }

  @Get('workflow-statuses')
  @ApiOperation({ summary: 'Get movement approval workflow statuses' })
  getMovementWorkflowStatuses() {
    return this.service.getMovementWorkflowStatuses();
  }

  @Get('stock-statuses')
  @ApiOperation({ summary: 'Get inventory stock status states' })
  getStockStatuses() {
    return this.service.getStockStatuses();
  }

  @Get('serial-statuses')
  @ApiOperation({ summary: 'Get unit serial status states' })
  getSerialStatuses() {
    return this.service.getSerialStatuses();
  }
}
