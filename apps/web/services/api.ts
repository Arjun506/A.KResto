import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import type { ApiFailure } from '../src/types/api.types';



export const getApiBaseUrl = () => {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/+$/, '');
  return raw.endsWith('/api/v1') ? raw : `${raw}/api/v1`;
};

function isBrowser() {
  return typeof window !== 'undefined';
}

const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Strip duplicate /api/v1 prefixes if accidentally included in endpoint path
    if (config.url) {
      if (config.url.startsWith('/api/v1/')) {
        config.url = config.url.replace(/^\/api\/v1\//, '/');
      } else if (config.url.startsWith('api/v1/')) {
        config.url = config.url.replace(/^api\/v1\//, '');
      }
    }

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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiFailure>) => {

    if (error.response?.status === 401 && isBrowser()) {
      window.localStorage.removeItem('token');
      window.sessionStorage.removeItem('token');
      // optional: hard reload to let ProtectedRoute redirect
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default api;



