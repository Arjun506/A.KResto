import api from './api';
import { unwrap } from './helpers';

import type { InventoryItem, PurchaseOrder, Supplier } from '@/src/types/inventory.types';

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  return unwrap<InventoryItem[]>(api.get('/inventory/items'));
};

export const createInventoryItem = async (data: {
  name: string;
  sku?: string;
  quantity: number;
  unit: string;
  lowStockLevel?: number;
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
): Promise<InventoryItem> => {
  return unwrap<InventoryItem>(
    api.patch(`/inventory/items/${id}/deduct`, { quantity }),
  );
};

export const getLowStockAlerts = async (): Promise<InventoryItem[]> => {
  return unwrap<InventoryItem[]>(api.get('/inventory/alerts/low-stock'));
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

