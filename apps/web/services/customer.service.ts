import api from './api';
import { unwrap } from './helpers';

export interface Customer {
  id: string;
  tenantId?: string;
  customerCode?: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  lifecycleStage: string;
  tier: string;
  pointsTotal: number;
  ordersCount: number;
  totalSpending: number;
  segment: string;
  tags: string[];
  createdAt: string;
}

export interface Customer360Data {
  customerId: string;
  customerDetails: {
    name: string;
    email: string | null;
    phone: string | null;
    status: string;
    customerCode: string | null;
    identityType: string;
    lifecycleStage: string;
    source: string;
    language: string;
    createdAt: string;
    addresses: any[];
    tags: string[];
    notes: any[];
  };
  metrics: {
    totalSpending: number;
    totalVisits: number;
    averageOrderValue: number;
    lifetimeValue: number;
    firstVisit: string | null;
    lastVisit: string | null;
    segment: string;
  };
  loyaltySummary: {
    tier: string;
    pointsTotal: number;
    status: string;
    ledger: any[];
  };
  rewards: {
    available: any[];
    redemptions: any[];
  };
  offers: any[];
  ordersCount: number;
  recentOrders: any[];
  recentPayments: any[];
  tickets: any[];
  timeline: any[];
}

export const CustomerService = {
  async listCustomers(params?: { search?: string; status?: string; segment?: string; page?: number; limit?: number }) {
    const res = await api.get('/customers', { params });
    return unwrap<any>(res);
  },

  async createCustomer(data: {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    identityType?: string;
  }) {
    const res = await api.post('/customers', data);
    return unwrap<Customer>(res);
  },

  async getCustomer360(customerId: string): Promise<Customer360Data> {
    const res = await api.get(`/crm-customer-360/${customerId}`);
    return unwrap<Customer360Data>(res);
  },

  async awardLoyaltyPoints(customerId: string, points: number, reasonCode: string) {
    const loyaltyRes = await api.get(`/crm-loyalty/customer/${customerId}`);
    const loyalty = unwrap<any>(loyaltyRes);
    const loyaltyId = loyalty.id || loyalty.loyaltyId;

    const res = await api.post(`/crm-loyalty/${loyaltyId}/award`, { points, reasonCode });
    return unwrap<any>(res);
  },

  async redeemLoyaltyPoints(customerId: string, points: number, reasonCode: string) {
    const loyaltyRes = await api.get(`/crm-loyalty/customer/${customerId}`);
    const loyalty = unwrap<any>(loyaltyRes);
    const loyaltyId = loyalty.id || loyalty.loyaltyId;

    const res = await api.post(`/crm-loyalty/${loyaltyId}/redeem`, { points, reasonCode });
    return unwrap<any>(res);
  },

  async redeemReward(customerId: string, rewardId: string) {
    const res = await api.post(`/crm-rewards/customer/${customerId}/redeem/${rewardId}`);
    return unwrap<any>(res);
  },

  async addNote(customerId: string, content: string) {
    const res = await api.post(`/customers/${customerId}/notes`, { content });
    return unwrap<any>(res);
  },

  async getReferralCode(customerId: string) {
    const res = await api.get(`/crm-referrals/customer/${customerId}/code`);
    return unwrap<any>(res);
  },
};
