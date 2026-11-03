import type { CsrfTokenResponse, EmailLoginRequest } from '../../types/auth';

import { apiClient } from '../client';

export async function loginStudent(requestBody: EmailLoginRequest) {
  await apiClient.post('/api/auth/login', requestBody);
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
