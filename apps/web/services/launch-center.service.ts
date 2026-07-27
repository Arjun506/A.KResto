import api from './api';

export interface ChecklistItem {
  key: string;
  label: string;
  description: string;
  completed: boolean;
  actionText: string;
  href: string;
}

export interface LaunchStatusResponse {
  percentage: number;
  completedCount: number;
  totalCount: number;
  checklist: ChecklistItem[];
  healthScore: number;
  missingConfig: string[];
  nextRecommendedStep: ChecklistItem | null;
}

export async function getLaunchStatus(): Promise<LaunchStatusResponse> {
  const res = await api.get('/business/launch-status');
  if (res.data.success) return res.data.data;
  throw new Error(res.data.message || 'Failed to fetch launch status');
}

