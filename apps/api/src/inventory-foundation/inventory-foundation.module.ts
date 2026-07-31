import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusModule } from '../event-bus/event-bus.module';
import { AuditModule } from '../audit/audit.module';

import { InventoryRegistryRepository } from './registry/inventory-registry.repository';
import { InventoryRegistryService } from './registry/inventory-registry.service';
import { InventoryRegistryController } from './registry/inventory-registry.controller';

import { WarehousesService } from './warehouses/warehouses.service';
import { WarehousesController } from './warehouses/warehouses.controller';

import { StorageLocationsService } from './storage-locations/storage-locations.service';
import { StorageLocationsController } from './storage-locations/storage-locations.controller';

import { InventoryStatusService } from './status-engine/inventory-status.service';
import { InventoryStatusController } from './status-engine/inventory-status.controller';

import { MovementWorkflowService } from './approval-workflow/movement-workflow.service';
import { MovementWorkflowController } from './approval-workflow/movement-workflow.controller';

import { InventoryAllocationService } from './allocation-engine/inventory-allocation.service';
import { InventoryAllocationController } from './allocation-engine/inventory-allocation.controller';

import { QualityInspectionService } from './quality-inspection/quality-inspection.service';
import { QualityInspectionController } from './quality-inspection/quality-inspection.controller';

import { InventoryForecastingService } from './forecasting/inventory-forecasting.service';
import { InventoryForecastingController } from './forecasting/inventory-forecasting.controller';

import { InventorySnapshotsService } from './snapshots/inventory-snapshots.service';
import { InventorySnapshotsController } from './snapshots/inventory-snapshots.controller';

import { InventoryVersioningService } from './versioning/inventory-versioning.service';
import { InventoryVersioningController } from './versioning/inventory-versioning.controller';

import { StockLevelsService } from './stock-levels/stock-levels.service';
import { StockLevelsController } from './stock-levels/stock-levels.controller';

import { StockMovementsService } from './stock-movements/stock-movements.service';
import { StockMovementsController } from './stock-movements/stock-movements.controller';

import { StockReservationsService } from './stock-reservations/stock-reservations.service';
import { StockReservationsController } from './stock-reservations/stock-reservations.controller';

import { BatchManagementService } from './batch-management/batch-management.service';
import { BatchManagementController } from './batch-management/batch-management.controller';

import { SerialManagementService } from './serial-management/serial-management.service';
import { SerialManagementController } from './serial-management/serial-management.controller';

import { ExpiryManagementService } from './expiry-management/expiry-management.service';
import { ExpiryManagementController } from './expiry-management/expiry-management.controller';

import { InventoryAdjustmentsService } from './adjustments/inventory-adjustments.service';
import { InventoryAdjustmentsController } from './adjustments/inventory-adjustments.controller';

import { StockTransfersService } from './transfers/stock-transfers.service';
import { StockTransfersController } from './transfers/stock-transfers.controller';

import { ReorderRulesService } from './reorder-rules/reorder-rules.service';
import { ReorderRulesController } from './reorder-rules/reorder-rules.controller';

import { InventoryValuationService } from './valuation/inventory-valuation.service';
import { InventoryValuationController } from './valuation/inventory-valuation.controller';

import { InventoryLookupService } from './lookups/inventory-lookup.service';
import { InventoryLookupController } from './lookups/inventory-lookup.controller';

@Module({
  imports: [EventBusModule, AuditModule],
  controllers: [
    InventoryRegistryController,
    WarehousesController,
    StorageLocationsController,
    InventoryStatusController,
    MovementWorkflowController,
    InventoryAllocationController,
    QualityInspectionController,
    InventoryForecastingController,
    InventorySnapshotsController,
    InventoryVersioningController,
    StockLevelsController,
    StockMovementsController,
    StockReservationsController,
    BatchManagementController,
    SerialManagementController,
    ExpiryManagementController,
    InventoryAdjustmentsController,
    StockTransfersController,
    ReorderRulesController,
    InventoryValuationController,
    InventoryLookupController,
  ],
  providers: [InventoryRegistryRepository,
    InventoryRegistryService,
    WarehousesService,
    StorageLocationsService,
    InventoryStatusService,
    MovementWorkflowService,
    InventoryAllocationService,
    QualityInspectionService,
    InventoryForecastingService,
    InventorySnapshotsService,
    InventoryVersioningService,
    StockLevelsService,
    StockMovementsService,
    StockReservationsService,
    BatchManagementService,
    SerialManagementService,
    ExpiryManagementService,
    InventoryAdjustmentsService,
    StockTransfersService,
    ReorderRulesService,
    InventoryValuationService,
    InventoryLookupService],
  exports: [
    InventoryRegistryService,
    WarehousesService,
    StockLevelsService,
    StockMovementsService,
    StockReservationsService,
    InventoryValuationService,
  ],
})
export class InventoryFoundationModule {}
