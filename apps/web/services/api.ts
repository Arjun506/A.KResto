import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import type { ApiFailure } from '../src/types/api.types';



const getApiBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001';
  return url.endsWith('/api/v1') ? url : `${url}/api/v1`;
};

function isBrowser() {
  return typeof window !== 'undefined';
}

const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
});

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



