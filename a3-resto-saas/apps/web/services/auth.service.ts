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
): Promise<AuthAccessTokenResponse> {
  const payload: AuthLoginRequest = { email, password };
  return unwrap<AuthAccessTokenResponse>(
    api.post('/auth/login', payload),
  );
}


