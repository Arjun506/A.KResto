export type InventoryItem = {
  id: string;
  restaurantId: string;
  name: string;
  sku?: string | null;
  quantity: string;
  unit: string;
  lowStockLevel: string;
  supplierId?: string | null;
  isLowStock?: boolean;
};

export type Supplier = {
  id: string;
  restaurantId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
};

export type PurchaseOrder = {
  id: string;
  restaurantId: string;
  supplierId?: string | null;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  totalAmount: string;
};

