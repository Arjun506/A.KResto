import api from './api';
import { unwrap } from './helpers';

import type { MenuCategory, MenuItem, CreateMenuItemRequest } from '@/src/types/menu.types';

export const getCategories = async (): Promise<MenuCategory[]> => {
  return unwrap<MenuCategory[]>(api.get('/menu/categories'));
};

export const createCategory = async (data: {
  name: string;
  sortOrder?: number;
  isActive?: boolean;
}): Promise<MenuCategory> => {
  return unwrap<MenuCategory>(api.post('/menu/categories', data));
};

export const updateCategory = async (
  id: string,
  data: Partial<MenuCategory>,
): Promise<MenuCategory> => {
  return unwrap<MenuCategory>(api.patch(`/menu/categories/${id}`, data));
};

export const deleteCategory = async (id: string): Promise<{ id: string }> => {
  return unwrap<{ id: string }>(api.delete(`/menu/categories/${id}`));
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  return unwrap<MenuItem[]>(api.get('/menu/items'));
};

export const createMenuItem = async (
  data: CreateMenuItemRequest,
): Promise<MenuItem> => {
  return unwrap<MenuItem>(api.post('/menu/items', data));
};

export const updateMenuItem = async (
  id: string,
  data: Partial<CreateMenuItemRequest>,
): Promise<MenuItem> => {
  return unwrap<MenuItem>(api.patch(`/menu/items/${id}`, data));
};

export const updateMenuAvailability = async (
  id: string,
  isAvailable: boolean,
): Promise<MenuItem> => {
  return unwrap<MenuItem>(
    api.patch(`/menu/items/${id}/availability`, { isAvailable }),
  );
};

export const deleteMenuItem = async (id: string): Promise<{ id: string }> => {
  return unwrap<{ id: string }>(api.delete(`/menu/items/${id}`));
};


