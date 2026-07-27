export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<TData = unknown> {
  success: boolean;
  message?: string;
  data?: TData;
  meta?: PaginationMeta;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
  traceId?: string;
}

export interface ApiSuccess<TData> extends ApiResponse<TData> {
  success: true;
  data: TData;
}

export interface ApiErrorResponse extends ApiResponse<never> {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const createApiSuccess = <TData>(
  data: TData,
  message?: string,
  meta?: PaginationMeta,
  traceId?: string,
): ApiSuccess<TData> => {
  return {
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
    traceId,
  };
};

export const createApiError = (
  code: string,
  message: string,
  details?: unknown,
  traceId?: string,
): ApiErrorResponse => {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
    traceId,
  };
};

// Backward-compatibility aliases
export const apiSuccess = <TData>(
  data: TData,
  message?: string,
): ApiSuccess<TData> => {
  return createApiSuccess(data, message);
};

export const apiError = (
  error: unknown,
  message?: string,
): ApiErrorResponse => {
  return createApiError('ERROR', message || 'An error occurred', error);
};
