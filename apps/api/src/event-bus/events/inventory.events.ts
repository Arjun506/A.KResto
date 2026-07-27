import { DomainEvent } from '../domain-event.interface';

export class InventoryCreatedEvent implements DomainEvent<{
  inventoryItemId: string;
  sku: string;
  name: string;
}> {
  readonly eventName = 'inventory.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      inventoryItemId: string;
      sku: string;
      name: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class WarehouseCreatedEvent implements DomainEvent<{
  warehouseId: string;
  code: string;
  name: string;
}> {
  readonly eventName = 'inventory.warehouse.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      warehouseId: string;
      code: string;
      name: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class WarehouseUpdatedEvent implements DomainEvent<{
  warehouseId: string;
  changes: Record<string, any>;
}> {
  readonly eventName = 'inventory.warehouse.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      warehouseId: string;
      changes: Record<string, any>;
    },
    public readonly tenantId?: string,
  ) {}
}

export class StockReceivedEvent implements DomainEvent<{
  inventoryItemId: string;
  warehouseId: string;
  quantity: number;
  unitCost: number;
}> {
  readonly eventName = 'inventory.stock.received';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      inventoryItemId: string;
      warehouseId: string;
      quantity: number;
      unitCost: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class StockIssuedEvent implements DomainEvent<{
  inventoryItemId: string;
  warehouseId: string;
  quantity: number;
}> {
  readonly eventName = 'inventory.stock.issued';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      inventoryItemId: string;
      warehouseId: string;
      quantity: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class StockTransferredEvent implements DomainEvent<{
  sourceWarehouseId: string;
  targetWarehouseId: string;
  inventoryItemId: string;
  quantity: number;
}> {
  readonly eventName = 'inventory.stock.transferred';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      sourceWarehouseId: string;
      targetWarehouseId: string;
      inventoryItemId: string;
      quantity: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class StockReservedEvent implements DomainEvent<{
  inventoryItemId: string;
  warehouseId: string;
  quantity: number;
  reservedForId: string;
}> {
  readonly eventName = 'inventory.stock.reserved';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      inventoryItemId: string;
      warehouseId: string;
      quantity: number;
      reservedForId: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class StockReleasedEvent implements DomainEvent<{
  reservationId: string;
  inventoryItemId: string;
  quantity: number;
}> {
  readonly eventName = 'inventory.stock.released';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      reservationId: string;
      inventoryItemId: string;
      quantity: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class StockAllocatedEvent implements DomainEvent<{
  inventoryItemId: string;
  warehouseId: string;
  quantity: number;
}> {
  readonly eventName = 'inventory.stock.allocated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      inventoryItemId: string;
      warehouseId: string;
      quantity: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class StockDeallocatedEvent implements DomainEvent<{
  inventoryItemId: string;
  warehouseId: string;
  quantity: number;
}> {
  readonly eventName = 'inventory.stock.deallocated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      inventoryItemId: string;
      warehouseId: string;
      quantity: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class StockAdjustedEvent implements DomainEvent<{
  inventoryItemId: string;
  warehouseId: string;
  adjustmentQuantity: number;
}> {
  readonly eventName = 'inventory.stock.adjusted';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      inventoryItemId: string;
      warehouseId: string;
      adjustmentQuantity: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class BatchCreatedEvent implements DomainEvent<{
  batchId: string;
  batchNumber: string;
  inventoryItemId: string;
}> {
  readonly eventName = 'inventory.batch.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      batchId: string;
      batchNumber: string;
      inventoryItemId: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class SerialAssignedEvent implements DomainEvent<{
  serialId: string;
  serialNumber: string;
  inventoryItemId: string;
}> {
  readonly eventName = 'inventory.serial.assigned';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      serialId: string;
      serialNumber: string;
      inventoryItemId: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ExpiryDetectedEvent implements DomainEvent<{
  inventoryItemId: string;
  batchNumber?: string;
  expiresAt: Date;
}> {
  readonly eventName = 'inventory.expiry.detected';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      inventoryItemId: string;
      batchNumber?: string;
      expiresAt: Date;
    },
    public readonly tenantId?: string,
  ) {}
}

export class InspectionCompletedEvent implements DomainEvent<{
  inspectionId: string;
  inventoryItemId: string;
  status: string;
}> {
  readonly eventName = 'inventory.inspection.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      inspectionId: string;
      inventoryItemId: string;
      status: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ForecastGeneratedEvent implements DomainEvent<{
  inventoryItemId: string;
  predictedDemand: number;
}> {
  readonly eventName = 'inventory.forecast.generated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      inventoryItemId: string;
      predictedDemand: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class InventorySnapshotCreatedEvent implements DomainEvent<{
  snapshotId: string;
  totalQuantity: number;
  totalValuation: number;
}> {
  readonly eventName = 'inventory.snapshot.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      snapshotId: string;
      totalQuantity: number;
      totalValuation: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ReorderTriggeredEvent implements DomainEvent<{
  inventoryItemId: string;
  currentQuantity: number;
  reorderQuantity: number;
}> {
  readonly eventName = 'inventory.reorder.triggered';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      inventoryItemId: string;
      currentQuantity: number;
      reorderQuantity: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class CycleCountCompletedEvent implements DomainEvent<{
  countNumber: string;
  warehouseId: string;
}> {
  readonly eventName = 'inventory.cycle_count.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { countNumber: string; warehouseId: string },
    public readonly tenantId?: string,
  ) {}
}

export class InventoryValuationUpdatedEvent implements DomainEvent<{
  inventoryItemId: string;
  newValuation: number;
}> {
  readonly eventName = 'inventory.valuation.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { inventoryItemId: string; newValuation: number },
    public readonly tenantId?: string,
  ) {}
}
