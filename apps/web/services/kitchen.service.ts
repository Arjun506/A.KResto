import api from './api';
import type { ApiResponse } from '../src/types/api.types';

export type KitchenStation = {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type KitchenTicketItem = {
  id: string;
  orderItemId: string;
  menuItemId: string;
  name: string;
  quantity: number;
  notes?: string | null;
};

export type KitchenTicket = {
  id: string;
  tenantId: string;
  orderId: string;
  orderNumber: string;
  customerName?: string | null;
  customerPhone?: string | null;
  tableId: string;
  tableName: string;
  stationCode: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  notes?: string | null;
  prepStartedAt?: string | null;
  prepCompletedAt?: string | null;
  servedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: KitchenTicketItem[];
};

const unwrap = async <T,>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> => {
  const res = await promise;
  if (res.data.success) return res.data.data;
  throw new Error(res.data.message || 'Request failed');
};

export const getKitchenStations = async (): Promise<KitchenStation[]> => {
  return unwrap<KitchenStation[]>(api.get('/kitchen/stations'));
};

export const getKitchenTickets = async (
  station?: string,
  status?: string,
): Promise<KitchenTicket[]> => {
  const params = new URLSearchParams();
  if (station && station !== 'ALL') params.append('station', station);
  if (status && status !== 'ALL') params.append('status', status);
  return unwrap<KitchenTicket[]>(api.get(`/kitchen/tickets?${params.toString()}`));
};

export const updateKitchenTicketStatus = async (
  id: string,
  status: string,
): Promise<KitchenTicket> => {
  return unwrap<KitchenTicket>(api.patch(`/kitchen/tickets/${id}/status`, { status }));
};

export const updateKitchenTicketPriority = async (
  id: string,
  priority: string,
): Promise<KitchenTicket> => {
  return unwrap<KitchenTicket>(api.patch(`/kitchen/tickets/${id}/priority`, { priority }));
};
