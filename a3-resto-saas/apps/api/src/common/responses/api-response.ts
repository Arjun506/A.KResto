export type ApiResponse<TData = unknown> = {
  success: boolean;
  message?: string;
  data?: TData;
  error?: unknown;
};

export type ApiSuccess<TData> = ApiResponse<TData> & {
  success: true;
};

export type ApiError = ApiResponse<never> & {
  success: false;
};

export const apiSuccess = <TData>(
  data: TData,
  message?: string,
): ApiSuccess<TData> => {
  const res: ApiSuccess<TData> = { success: true, data };
  if (message) res.message = message;
  return res;
};

export const apiError = (error: unknown, message?: string): ApiError => {
  const res: ApiError = { success: false, error };
  if (message) res.message = message;
  return res;
};
