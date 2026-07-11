import type { AxiosRequestConfig } from 'axios';

import type { ApiResponse } from '../types/api.types';

import api from '../../services/api';

import { ApiError, formatApiErrorMessage } from './api-error';

export async function request<T>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  try {
    const response = await api.request<ApiResponse<T>>(config);
    return response.data;
  } catch (err) {
    // We rethrow a normalized ApiError. Formatting is centralized at call sites.
    const axiosErr = err as unknown as {
      response?: { status?: number; data?: ApiResponse<T> };
      message?: string;
    };

    const status = axiosErr?.response?.status;
    const data = axiosErr?.response?.data;



    const message =
      data && typeof (data as { message?: unknown }).message === 'string'
        ? (data as { message?: string }).message
        : axiosErr?.message;

    throw new ApiError(formatApiErrorMessage(message), {
      status,
      details: axiosErr?.response?.data,
    });

  }
}

