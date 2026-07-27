import api from './api';
import type { ApiResponse } from '../src/types/api.types';

const unwrap = async <T,>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> => {
  const res = await promise;
  if (res.data.success) return res.data.data;
  throw new Error(res.data.message || 'Request failed');
};

export interface Table {
  id: string;
  tenantId: string;
  branchId: string | null;
  name: string;
  code: string;
  capacity: number;
  isActive: boolean;
  qrCode: string | null;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  activeOrderId?: string | null;
  currentGuests?: number;
}

export const getTables = async (): Promise<Table[]> => {
  return unwrap<Table[]>(api.get('/restaurants/tables'));
};

export const createTable = async (data: { name: string; code: string; capacity: number }): Promise<Table> => {
  return unwrap<Table>(api.post('/restaurants/tables', data));
};

export const updateTable = async (id: string, data: { name?: string; capacity?: number }): Promise<Table> => {
  return unwrap<Table>(api.patch(`/restaurants/tables/${id}`, data));
};

export const deleteTable = async (id: string): Promise<{ id: string }> => {
  return unwrap<{ id: string }>(api.delete(`/restaurants/tables/${id}`));
};

