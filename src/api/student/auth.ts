import type {
  CsrfTokenResponse,
  EmailLoginRequest,
  EmailSignupRequest,
} from '../../types/auth';

import { apiClient } from '../client';

export async function loginStudent(requestBody: EmailLoginRequest) {
  await apiClient.post('/api/auth/login', requestBody);
}

export async function signupStudent<TResponse = unknown>(
  requestBody: EmailSignupRequest,
): Promise<TResponse> {
  const { data } = await apiClient.post<TResponse>(
    '/api/auth/signup',
    requestBody,
  );

  return data;
}

export async function getAuthCsrfToken(): Promise<CsrfTokenResponse> {
  const { data } = await apiClient.get<CsrfTokenResponse>('/api/auth/csrf');

  return data;
}

export async function refreshAccessToken(): Promise<void> {
  const { headerName, token } = await getAuthCsrfToken();

  await apiClient.post('/api/auth/refresh', undefined, {
    headers: {
      [headerName]: token,
    },
  });
}

export async function logoutStudent(): Promise<void> {
  const { headerName, token } = await getAuthCsrfToken();

  await apiClient.post('/api/auth/logout', undefined, {
    headers: {
      [headerName]: token,
    },
  });
}
