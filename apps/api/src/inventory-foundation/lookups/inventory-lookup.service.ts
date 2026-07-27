import { Injectable } from '@nestjs/common';
import {
  WarehouseType,
  ValuationMethod,
  StockMovementType,
  MovementWorkflowStatus,
  StockStatus,
  SerialStatus,
} from '@prisma/client';

@Injectable()
export class InventoryLookupService {
  getWarehouseTypes() {
    return Object.values(WarehouseType).map((code) => ({ code, label: code }));
  }

  getValuationMethods() {
    return Object.values(ValuationMethod).map((code) => ({
      code,
      label: code,
    }));
  }

  getStockMovementTypes() {
    return Object.values(StockMovementType).map((code) => ({
      code,
      label: code,
    }));
  }

  getMovementWorkflowStatuses() {
    return Object.values(MovementWorkflowStatus).map((code) => ({
      code,
      label: code,
    }));
  }

  getStockStatuses() {
    return Object.values(StockStatus).map((code) => ({ code, label: code }));
  }

  getSerialStatuses() {
    return Object.values(SerialStatus).map((code) => ({ code, label: code }));
  }
}
