import type { ApiResponse } from '@/src/types/api.types';

export const unwrap = async <T,>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> => {
  const response = await promise;
  if (response.data.success) return response.data.data;
  throw new Error(response.data.message || 'Request failed');
};
