import api from './api';

import type {
  CreateRestaurantRequest,
  Restaurant,
  RestaurantsListResponse,
  UpdateRestaurantRequest,
} from '../src/types/restaurant.types';

import type { ApiResponse } from '../src/types/api.types';

const unwrap = async <T,>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> => {
  const res = await promise;
  if (res.data.success) return res.data.data;
  throw new Error(res.data.message || 'Request failed');
};

export const getRestaurants = async (): Promise<RestaurantsListResponse> => {
  return unwrap<RestaurantsListResponse>(api.get('/restaurants'));
};

export const getRestaurant = async (id: string): Promise<Restaurant> => {
  return unwrap<Restaurant>(api.get(`/restaurants/${id}`));
};

export const createRestaurant = async (
  data: CreateRestaurantRequest,
): Promise<Restaurant> => {
  return unwrap<Restaurant>(api.post('/restaurants', data));
};

export const updateRestaurant = async (
  id: string,
  data: UpdateRestaurantRequest,
): Promise<Restaurant> => {
  return unwrap<Restaurant>(api.patch(`/restaurants/${id}`, data));
};

export const deleteRestaurant = async (
  id: string,
): Promise<unknown> => {
  return unwrap<unknown>(api.delete(`/restaurants/${id}`));
};


