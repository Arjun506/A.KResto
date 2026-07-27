import api from './api';

import type {
  AuthLoginRequest,
  AuthAccessTokenResponse,
} from '../src/types/auth.types';

import type { ApiResponse } from '../src/types/api.types';

const unwrap = async <T,>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> => {
  const res = await promise;
  if (res.data.success) return res.data.data;
  throw new Error(res.data.message || 'Request failed');
};

export async function loginUser(
  email: string,
  password: string,
): Promise<any> {
  const payload: AuthLoginRequest = { email, password };
  return unwrap<any>(
    api.post('/auth/login', payload),
  );
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  tenantId?: string,
): Promise<any> {
  const payload = { name, email, password, tenantId };
  return unwrap<any>(
    api.post('/auth/register', payload),
  );
}

export async function refreshTokens(
  refreshToken: string,
): Promise<any> {
  return unwrap<any>(
    api.post('/auth/refresh', { refreshToken }),
  );
}

export async function logoutUser(
  refreshToken: string,
): Promise<any> {
  return unwrap<any>(
    api.post('/auth/logout', { refreshToken }),
  );
}

export async function requestForgotPassword(
  email: string,
): Promise<any> {
  return unwrap<any>(
    api.post('/auth/forgot-password/request', { email }),
  );
}

export async function verifyForgotPasswordOtp(
  email: string,
  code: string,
): Promise<any> {
  return unwrap<any>(
    api.post('/auth/forgot-password/verify', { email, code }),
  );
}

export async function resetPassword(
  resetToken: string,
  newPassword: string,
): Promise<any> {
  return unwrap<any>(
    api.post('/auth/forgot-password/reset', { resetToken, newPassword }),
  );
}

export async function requestEmailVerification(): Promise<any> {
  return unwrap<any>(
    api.post('/auth/verify-email/request'),
  );
}

export async function confirmEmailVerification(
  token: string,
): Promise<any> {
  return unwrap<any>(
    api.post('/auth/verify-email/confirm', { token }),
  );
}

export async function verify2faOtp(
  code: string,
): Promise<any> {
  return unwrap<any>(
    api.post('/auth/2fa/verify', { code }),
  );
}

