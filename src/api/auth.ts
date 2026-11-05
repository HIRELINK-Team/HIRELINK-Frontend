import apiClient from './client';
import { publicApiClient } from './baseClient';
import type {
  CsrfResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  RequestPhoneVerificationRequest,
  RequestPhoneVerificationResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
} from '../types/auth';

async function login(request: LoginRequest) {
  const response = await publicApiClient.post<LoginResponse>(
    '/auth/login',
    request,
  );
  return response.data;
}

async function getCsrfToken() {
  const response = await publicApiClient.get<CsrfResponse>('/auth/csrf');
  return response.data;
}

async function refreshAccessToken() {
  const csrf = await getCsrfToken();
  const response = await publicApiClient.post<RefreshResponse>(
    '/auth/refresh',
    undefined,
    {
      headers: { [csrf.headerName]: csrf.token },
    },
  );
  return response.data;
}

async function logout() {
  const csrf = await getCsrfToken();
  const response = await publicApiClient.post<LogoutResponse>(
    '/auth/logout',
    undefined,
    {
      headers: { [csrf.headerName]: csrf.token },
    },
  );
  return response.data;
}

async function requestPhoneVerification(
  request: RequestPhoneVerificationRequest,
): Promise<RequestPhoneVerificationResponse> {
  const { data } = await apiClient.post<RequestPhoneVerificationResponse>(
    '/auth/phone-verifications',
    request,
  );
  return data;
}

async function verifyPhone(
  request: VerifyPhoneRequest,
): Promise<VerifyPhoneResponse> {
  const { data } = await apiClient.post<VerifyPhoneResponse>(
    '/auth/phone-verifications/verify',
    request,
  );
  return data;
}

export {
  getCsrfToken,
  login,
  logout,
  refreshAccessToken,
  requestPhoneVerification,
  verifyPhone,
};
