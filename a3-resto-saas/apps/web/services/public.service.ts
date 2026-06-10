import api from './api';
import { unwrap } from './helpers';
import type { MenuCategory, MenuItem } from '@/src/types/menu.types';
import type { Order } from '@/src/types/order.types';

export interface CreatePublicOrderPayload {
  restaurantSlug: string;
  tableId: string;
  customerName?: string;
  phone?: string;
  notes?: string;
  items: {
    menuItemId: string;
    quantity: number;
    notes?: string;
  }[];
  qrToken?: string;
}

export interface WaiterRequestPayload {
  restaurantSlug: string;
  tableId: string;
  type: 'Need Water' | 'Call Waiter' | 'Need Bill' | 'Clean Table';
  qrToken?: string;
}

export const getPublicRestaurant = async (restaurantSlug: string): Promise<{ id: string; name: string; slug: string }> => {
  return unwrap<{ id: string; name: string; slug: string }>(api.get(`/public/restaurant/${restaurantSlug}`));
};

export const getPublicMenu = async (restaurantSlug: string): Promise<MenuItem[]> => {
  return unwrap<MenuItem[]>(api.get(`/public/menu/${restaurantSlug}`));
};

export const getPublicCategories = async (restaurantSlug: string): Promise<MenuCategory[]> => {
  return unwrap<MenuCategory[]>(api.get(`/public/categories/${restaurantSlug}`));
};

export const createPublicOrder = async (data: CreatePublicOrderPayload): Promise<Order> => {
  return unwrap<Order>(api.post('/public/orders', data));
};

export const getPublicOrder = async (orderId: string): Promise<Order> => {
  return unwrap<Order>(api.get(`/public/orders/${orderId}`));
};

export const createWaiterRequest = async (data: WaiterRequestPayload): Promise<{ success: boolean; message: string }> => {
  return unwrap<{ success: boolean; message: string }>(api.post('/public/waiter-request', data));
};
