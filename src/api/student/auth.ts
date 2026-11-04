import axios from 'axios';

import type {
  CsrfTokenResponse,
  EmailLoginRequest,
  EmailSignupRequest,
  LoginResponse,
  PhoneVerificationConfirmRequest,
  PhoneVerificationConfirmResponse,
  PhoneVerificationRequest,
  PhoneVerificationResponse,
  RefreshAccessTokenResponse,
  SignupResponse,
} from '../../types/auth';

import { clearAccessToken, setAccessToken } from '../accessToken';
import { apiClient } from '../client';

export async function loginStudent(
  requestBody: EmailLoginRequest,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    '/api/auth/login',
    requestBody,
    { withCredentials: true },
  );

  return data;
}

export async function signupStudent(
  requestBody: EmailSignupRequest,
): Promise<SignupResponse> {
  const { data } = await apiClient.post<SignupResponse>(
    '/api/auth/signup',
    requestBody,
    { withCredentials: true },
  );

  return data;
}

export async function getAuthCsrfToken(): Promise<CsrfTokenResponse> {
  const { data } = await apiClient.get<CsrfTokenResponse>('/api/auth/csrf', {
    withCredentials: true,
  });

  return data;
}

export async function refreshAccessToken(): Promise<RefreshAccessTokenResponse> {
  try {
    const { headerName, token } = await getAuthCsrfToken();
    const { data } = await apiClient.post<RefreshAccessTokenResponse>(
      '/api/auth/refresh',
      undefined,
      {
        headers: {
          [headerName]: token,
        },
        withCredentials: true,
      },
    );

    setAccessToken(data.accessToken);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAccessToken();
    }

    throw error;
  }
}

export async function logoutStudent(): Promise<void> {
  const { headerName, token } = await getAuthCsrfToken();

  await apiClient.post('/api/auth/logout', undefined, {
    headers: {
      [headerName]: token,
    },
    withCredentials: true,
  });

  clearAccessToken();
}

export async function requestPhoneVerification(
  requestBody: PhoneVerificationRequest,
): Promise<PhoneVerificationResponse> {
  const { data } = await apiClient.post<PhoneVerificationResponse>(
    '/api/auth/phone-verifications',
    requestBody,
  );

  return data;
}

export async function confirmPhoneVerification(
  requestBody: PhoneVerificationConfirmRequest,
): Promise<PhoneVerificationConfirmResponse> {
  const { data } = await apiClient.post<PhoneVerificationConfirmResponse>(
    '/api/auth/phone-verifications/verify',
    requestBody,
  );

  return data;
}
