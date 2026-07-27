import api from './api';
import type { ApiResponse } from '../src/types/api.types';

const unwrap = async <T,>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> => {
  const res = await promise;
  if (res.data.success) return res.data.data;
  throw new Error(res.data.message || 'Request failed');
};

export interface RegisterBusinessRequest {
  businessName: string;
  industry: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  currency?: string;
  timezone?: string;
  location?: string;
  address?: string;
  language?: string;
  themePreset?: string;
  selectedPlan?: string;
}

export interface RegisterBusinessResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
    industry: string;
  };
}

export interface Branch {
  id: string;
  tenantId?: string;
  name: string;
  code?: string | null;
  location?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
  status?: string;
  isMain?: boolean;
  isDefault?: boolean;
  managerName?: string | null;
  managerEmail?: string | null;
  managerPhone?: string | null;
  workingHours?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BranchAnalytics {
  totalRevenue: number;
  orderCount: number;
  tableOccupancyRate: number;
  activeReservations: number;
  popularItems: Array<{ name: string; count: number }>;
}

type BranchWritePayload = {
  name?: string;
  code?: string | null;
  location?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: string;
  isActive?: boolean;
};

const normalizeBranch = (branch: Branch, index = 0): Branch => ({
  ...branch,
  status: branch.status ?? (branch.isActive === false ? 'INACTIVE' : 'ACTIVE'),
  isMain: branch.isMain ?? index === 0,
  isDefault: branch.isDefault ?? index === 0,
});

const toBranchPayload = (data: BranchWritePayload): BranchWritePayload => {
  const payload: BranchWritePayload = {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.code !== undefined && { code: data.code }),
    ...(data.location !== undefined && { location: data.location }),
    ...(data.address !== undefined && { address: data.address }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.email !== undefined && { email: data.email }),
  };

  if (data.status !== undefined) {
    payload.isActive = data.status === 'ACTIVE';
  }

  if (data.isActive !== undefined) {
    payload.isActive = data.isActive;
  }

  return payload;
};

export const registerBusiness = async (
  data: RegisterBusinessRequest,
): Promise<RegisterBusinessResponse> => {
  return unwrap<RegisterBusinessResponse>(api.post('/business/register', data));
};

export const getBusinessSettings = async (): Promise<any> => {
  return unwrap<any>(api.get('/business/settings'));
};

export const updateBusinessSettings = async (data: any): Promise<any> => {
  return unwrap<any>(api.patch('/business/settings', data));
};

export const getBranches = async (): Promise<Branch[]> => {
  const branches = await unwrap<Branch[]>(api.get('/business/branches'));
  return branches.map(normalizeBranch);
};

export const createBranch = async (
  data: BranchWritePayload,
): Promise<Branch> => {
  const branch = await unwrap<Branch>(
    api.post('/business/branches', toBranchPayload(data)),
  );
  return normalizeBranch(branch);
};

export const updateBranch = async (
  id: string,
  data: BranchWritePayload,
): Promise<Branch> => {
  const branch = await unwrap<Branch>(
    api.patch(`/business/branches/${id}`, toBranchPayload(data)),
  );
  return normalizeBranch(branch);
};

export const deleteBranch = async (id: string): Promise<Branch> => {
  return updateBranch(id, { isActive: false });
};

export const getBranchAnalytics = async (
  id: string,
): Promise<BranchAnalytics> => {
  try {
    return await unwrap<BranchAnalytics>(
      api.get(`/business/branches/${id}/analytics`),
    );
  } catch {
    return {
      totalRevenue: 0,
      orderCount: 0,
      tableOccupancyRate: 0,
      activeReservations: 0,
      popularItems: [],
    };
  }
};

