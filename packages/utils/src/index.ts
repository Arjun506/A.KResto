import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiFailure } from '@business-os/types';

// Custom API Error Class
export class ApiError extends Error {
  status?: number;
  details?: any;

  constructor(message: string, options?: { status?: number; details?: any }) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.details = options?.details;
  }
}

// Utility to format API Error messages
export function formatApiErrorMessage(message: any): string {
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) return message.join(', ');
  if (message && typeof message === 'object') {
    return JSON.stringify(message);
  }
  return 'An unexpected API error occurred.';
}

const getApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env) {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return url.endsWith('/api/v1') ? url : `${url}/api/v1`;
  }
  return 'http://localhost:3001/api/v1';
};

function isBrowser() {
  return typeof window !== 'undefined';
}

// Instantiate Global Axios Client
export const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
});

// Request Interceptor: Inject JWT token from localStorage or sessionStorage
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!isBrowser()) return config;

    const token =
      window.localStorage.getItem('token') ||
      window.sessionStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Capture 401 Unauthorized errors and reload to login
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiFailure>) => {
    if (error.response?.status === 401 && isBrowser()) {
      window.localStorage.removeItem('token');
      window.sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Reusable request wrapper mapping errors
export async function request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await api.request<ApiResponse<T>>(config);
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError<ApiResponse<T>>;
    const status = axiosErr.response?.status;
    const data = axiosErr.response?.data;

    const message =
      data && typeof (data as any).message === 'string'
        ? (data as any).message
        : axiosErr.message;

    throw new ApiError(formatApiErrorMessage(message), {
      status,
      details: data,
    });
  }
}

export default api;
