import api from './api';
import { unwrap } from './helpers';

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  operatingHours?: any;
  timezone?: string;
  currency?: string;
  status: string;
  managerId?: string;
  industryType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  distanceKm?: number;
}

export interface InventoryTransfer {
  id: string;
  tenantId: string;
  referenceNumber: string;
  sourceBranchId: string;
  destinationBranchId: string;
  status: string;
  notes?: string;
  requestedAt?: string;
  approvedAt?: string;
  shippedAt?: string;
  receivedAt?: string;
  createdAt: string;
  items: {
    id: string;
    inventoryItemId: string;
    itemName: string;
    quantity: number;
    unit: string;
  }[];
  sourceBranch?: Branch;
  destinationBranch?: Branch;
}

export const BranchService = {
  async listBranches(params?: { status?: string; industryType?: string }) {
    const res = await api.get('/branches', { params });
    return unwrap<Branch[]>(res);
  },

  async createBranch(data: {
    name: string;
    code?: string;
    address?: string;
    phone?: string;
    email?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    operatingHours?: any;
    timezone?: string;
    currency?: string;
    status?: string;
    industryType?: string;
  }) {
    const res = await api.post('/branches', data);
    return unwrap<Branch>(res);
  },

  async updateBranch(id: string, data: Partial<Branch>) {
    const res = await api.patch(`/branches/${id}`, data);
    return unwrap<Branch>(res);
  },

  async updateBranchStatus(id: string, status: string) {
    const res = await api.patch(`/branches/${id}/status`, { status });
    return unwrap<Branch>(res);
  },

  async findNearbyBranches(latitude: number, longitude: number, radiusKm = 10, industryType?: string) {
    const res = await api.get('/branches/nearby', {
      params: { latitude, longitude, radiusKm, industryType },
    });
    return unwrap<Branch[]>(res);
  },

  // Branch Menu Overrides
  async setBranchMenuConfig(branchId: string, menuItemId: string, isAvailable?: boolean, priceOverride?: number) {
    const res = await api.post(`/branches/${branchId}/menu-configs`, { menuItemId, isAvailable, priceOverride });
    return unwrap<any>(res);
  },

  async getBranchMenuConfigs(branchId: string) {
    const res = await api.get(`/branches/${branchId}/menu-configs`);
    return unwrap<any[]>(res);
  },

  // Branch Inventory & Inter-Branch Transfers
  async getBranchInventory(branchId: string) {
    const res = await api.get(`/branches/${branchId}/inventory`);
    return unwrap<any[]>(res);
  },

  async createTransfer(data: {
    sourceBranchId: string;
    destinationBranchId: string;
    notes?: string;
    items: { inventoryItemId: string; quantity: number }[];
  }) {
    const res = await api.post('/inventory/transfers', data);
    return unwrap<InventoryTransfer>(res);
  },

  async listTransfers(branchId?: string, status?: string) {
    const res = await api.get('/inventory/transfers', { params: { branchId, status } });
    return unwrap<InventoryTransfer[]>(res);
  },

  async approveTransfer(id: string) {
    const res = await api.post(`/inventory/transfers/${id}/approve`);
    return unwrap<InventoryTransfer>(res);
  },

  async shipTransfer(id: string) {
    const res = await api.post(`/inventory/transfers/${id}/ship`);
    return unwrap<InventoryTransfer>(res);
  },

  async receiveTransfer(id: string) {
    const res = await api.post(`/inventory/transfers/${id}/receive`);
    return unwrap<InventoryTransfer>(res);
  },

  async cancelTransfer(id: string) {
    const res = await api.post(`/inventory/transfers/${id}/cancel`);
    return unwrap<InventoryTransfer>(res);
  },
};
