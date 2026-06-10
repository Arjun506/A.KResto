import api from './api';

import type {
  CreateOrderRequest,
  Order,
  OrdersListResponse,
} from '../src/types/order.types';

import type { ApiResponse } from '../src/types/api.types';

const unwrap = async <T,>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> => {
  const res = await promise;
  if (res.data.success) return res.data.data;
  throw new Error(res.data.message || 'Request failed');
};

export const getOrders = async (): Promise<OrdersListResponse> => {
  return unwrap<OrdersListResponse>(api.get('/orders'));
};

export const createOrder = async (
  data: CreateOrderRequest,
): Promise<Order> => {
  return unwrap<Order>(api.post('/orders', data));
};

export const updateOrderStatus = async (
  id: string,
  status: string,
): Promise<Order> => {
  return unwrap<Order>(api.patch(`/orders/${id}/status`, { status }));
};

