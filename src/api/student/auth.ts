import type {
  CsrfTokenResponse,
  EmailLoginRequest,
  EmailSignupRequest,
  LoginResponse,
  LogoutResponse,
  PhoneVerificationConfirmRequest,
  PhoneVerificationConfirmResponse,
  PhoneVerificationRequest,
  PhoneVerificationResponse,
  RefreshAccessTokenResponse,
  SignupResponse,
} from '../../types/auth';

import { clearAccessToken, setAccessToken } from '../accessToken';
import { apiClient, registerAccessTokenRefreshHandler } from '../client';

let refreshAccessTokenPromise: Promise<RefreshAccessTokenResponse> | null =
  null;

export async function loginStudent(
  requestBody: EmailLoginRequest,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    '/auth/login',
    requestBody,
    { withCredentials: true },
  );

  return data;
}

export async function signupStudent(
  requestBody: EmailSignupRequest,
): Promise<SignupResponse> {
  const { data } = await apiClient.post<SignupResponse>(
    '/auth/signup',
    requestBody,
    { withCredentials: true },
  );

  return data;
}

export async function getAuthCsrfToken(): Promise<CsrfTokenResponse> {
  const { data } = await apiClient.get<CsrfTokenResponse>('/auth/csrf', {
    withCredentials: true,
  });

  return data;
}

async function performAccessTokenRefresh(): Promise<RefreshAccessTokenResponse> {
  try {
    const { headerName, token } = await getAuthCsrfToken();
    const { data } = await apiClient.post<RefreshAccessTokenResponse>(
      '/auth/refresh',
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
    clearAccessToken();
    throw error;
  }
}

export function refreshAccessToken(): Promise<RefreshAccessTokenResponse> {
  if (!refreshAccessTokenPromise) {
    refreshAccessTokenPromise = performAccessTokenRefresh().finally(() => {
      refreshAccessTokenPromise = null;
    });
  }

  return refreshAccessTokenPromise;
}

registerAccessTokenRefreshHandler(async () => {
  const { accessToken } = await refreshAccessToken();
  return accessToken;
});

export async function logoutStudent(): Promise<LogoutResponse> {
  const { headerName, token } = await getAuthCsrfToken();

  const { data } = await apiClient.post<LogoutResponse>(
    '/auth/logout',
    undefined,
    {
      headers: {
        [headerName]: token,
      },
      withCredentials: true,
    },
  );

  clearAccessToken();

  return data;
}

export async function requestPhoneVerification(
  requestBody: PhoneVerificationRequest,
): Promise<PhoneVerificationResponse> {
  const { data } = await apiClient.post<PhoneVerificationResponse>(
    '/auth/phone-verifications',
    requestBody,
  );

  return data;
}

export async function confirmPhoneVerification(
  requestBody: PhoneVerificationConfirmRequest,
): Promise<PhoneVerificationConfirmResponse> {
  const { data } = await apiClient.post<PhoneVerificationConfirmResponse>(
    '/auth/phone-verifications/verify',
    requestBody,
  );

  return data;
}
