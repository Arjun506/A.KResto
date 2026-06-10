import type { ApiResponse } from '../types/api.types';

import { ApiError, formatApiErrorMessage } from './api-error';

export function unwrapApiResponse<T>(
  res: ApiResponse<T>,
): T {
  if (res.success) return res.data;
  throw new ApiError(formatApiErrorMessage(res.message), {
    status: undefined,
    details: res,
  });
}

