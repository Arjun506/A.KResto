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

export type CheckoutOrderRequest = {
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'WALLET';
  amount: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  transactionId?: string;
};

export type CheckoutOrderResponse = {
  order: Order;
  invoice: {
    id: string;
    invoiceNumber: string;
    orderId: string;
    subtotal: string;
    tax: string;
    serviceCharge: string;
    discount: string;
    grandTotal: string;
    pdfUrl?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  payment: {
    id: string;
    orderId: string;
    amount: string;
    paymentMethod: string;
    transactionId?: string | null;
    status: string;
    registerSessionId?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  registerSessionId: string;
  inventoryConsumed: Array<{ inventoryItemId: string; quantity: number }>;
};

export const checkoutOrder = async (
  id: string,
  data: CheckoutOrderRequest,
): Promise<CheckoutOrderResponse> => {
  return unwrap<CheckoutOrderResponse>(
    api.post(`/orders/${id}/checkout`, data),
  );
};
