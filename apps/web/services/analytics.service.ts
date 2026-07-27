import api from './api';
import { unwrap } from './helpers';

export interface DashboardKPIs {
  totalRevenue: string;
  todayRevenue: string;
  totalOrders: number;
  todayOrders: number;
  activeCustomers: number;
  averageOrderValue: string;
}

export interface RevenueBucket {
  label: string;
  revenue: string;
}

export interface RevenueResponse {
  daily: RevenueBucket[];
  weekly: RevenueBucket[];
  monthly: RevenueBucket[];
}

export interface MenuItemAgg {
  menuItemId: string;
  name: string;
  quantity: number;
  revenue: string;
}

export interface MenuResponse {
  topSellingItems: MenuItemAgg[];
  lowestSellingItems: MenuItemAgg[];
}

export const getDashboardKPIs = async (): Promise<DashboardKPIs> => {
  return unwrap<DashboardKPIs>(api.get('/analytics/kpis'));
};

export const getRevenueAnalytics = async (): Promise<RevenueResponse> => {
  return unwrap<RevenueResponse>(api.get('/analytics/revenue'));
};

export const getMenuAnalytics = async (): Promise<MenuResponse> => {
  return unwrap<MenuResponse>(api.get('/analytics/menu'));
};

