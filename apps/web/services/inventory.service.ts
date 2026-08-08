import api from './api';
import { unwrap } from './helpers';

import type { InventoryItem, PurchaseOrder, Supplier } from '@/src/types/inventory.types';

export interface InventoryMovement {
  id: string;
  inventoryItemId: string;
  type: string;
  quantity: number;
  unit?: string;
  beforeQuantity?: number;
  afterQuantity?: number;
  referenceType?: string;
  referenceId?: string;
  reason?: string;
  createdAt: string;
  inventory_items?: InventoryItem;
}

export interface MenuItemIngredient {
  id: string;
  menuItemId: string;
  inventoryItemId: string;
  quantity: number;
  unit?: string;
  wastagePercent?: number;
  convertedQuantityInStockUnit?: number;
  ingredientCost?: number;
  inventory_items: InventoryItem;
}

export interface RecipeData {
  menuItemId: string;
  recipeCost: number;
  ingredients: MenuItemIngredient[];
}

export interface InventoryDashboardSummary {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValue: number;
  recentMovements: InventoryMovement[];
  topConsumed: Array<{
    inventoryItemId: string;
    name: string;
    unit: string;
    totalQuantity: number;
  }>;
}

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  return unwrap<InventoryItem[]>(api.get('/inventory/items'));
};

export const createInventoryItem = async (data: {
  name: string;
  sku?: string;
  category?: string;
  quantity: number;
  unit: string;
  lowStockLevel?: number;
  reorderLevel?: number;
  costPerUnit?: number;
  supplierId?: string;
}): Promise<InventoryItem> => {
  return unwrap<InventoryItem>(api.post('/inventory/items', data));
};

export const updateInventoryItem = async (
  id: string,
  data: Partial<InventoryItem>,
): Promise<InventoryItem> => {
  return unwrap<InventoryItem>(api.patch(`/inventory/items/${id}`, data));
};

export const deductStock = async (
  id: string,
  quantity: number,
  reason?: string,
): Promise<InventoryItem> => {
  return unwrap<InventoryItem>(
    api.patch(`/inventory/items/${id}/deduct`, { quantity, reason }),
  );
};

export const adjustStock = async (
  id: string,
  changeQuantity: number,
  type?: string,
  reason?: string,
): Promise<InventoryItem> => {
  return unwrap<InventoryItem>(
    api.patch(`/inventory/items/${id}/adjust`, { changeQuantity, type, reason }),
  );
};

export const getLowStockAlerts = async (): Promise<InventoryItem[]> => {
  return unwrap<InventoryItem[]>(api.get('/inventory/alerts/low-stock'));
};

export const getInventoryMovements = async (params?: {
  type?: string;
  inventoryItemId?: string;
}): Promise<InventoryMovement[]> => {
  return unwrap<InventoryMovement[]>(api.get('/inventory/movements', { params }));
};

export const getDashboardSummary = async (): Promise<InventoryDashboardSummary> => {
  return unwrap<InventoryDashboardSummary>(api.get('/inventory/dashboard/summary'));
};

export const getMenuItemRecipe = async (menuItemId: string): Promise<RecipeData> => {
  return unwrap<RecipeData>(api.get(`/inventory/menu-items/${menuItemId}/ingredients`));
};

export const setMenuItemIngredients = async (
  menuItemId: string,
  ingredients: Array<{
    inventoryItemId: string;
    quantity: number;
    unit?: string;
    wastagePercent?: number;
  }>,
): Promise<RecipeData> => {
  return unwrap<RecipeData>(
    api.patch(`/inventory/menu-items/${menuItemId}/ingredients`, { ingredients }),
  );
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  return unwrap<Supplier[]>(api.get('/inventory/suppliers'));
};

export const createSupplier = async (data: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}): Promise<Supplier> => {
  return unwrap<Supplier>(api.post('/inventory/suppliers', data));
};

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  return unwrap<PurchaseOrder[]>(api.get('/inventory/purchase-orders'));
};

export const createPurchaseOrder = async (data: {
  supplierId?: string;
  expectedDeliveryDate?: string;
  notes?: string;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
}): Promise<PurchaseOrder> => {
  return unwrap<PurchaseOrder>(api.post('/inventory/purchase-orders', data));
};

export const updatePurchaseOrderStatus = async (
  id: string,
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED',
): Promise<PurchaseOrder> => {
  return unwrap<PurchaseOrder>(
    api.patch(`/inventory/purchase-orders/${id}/status`, { status }),
  );
};
