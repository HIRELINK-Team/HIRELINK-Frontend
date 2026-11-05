import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_BASE_URL } from './baseClient';
import { getAccessToken } from './accessToken';
import { refreshSessionOnce } from './authSession';
import type { ApiErrorResponse } from '../types/auth';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _accessToken?: string;
  _retry?: boolean;
}

type AccessTokenRefreshHandler = () => Promise<string>;

let accessTokenRefreshHandler: AccessTokenRefreshHandler | null = null;

function registerAccessTokenRefreshHandler(handler: AccessTokenRefreshHandler) {
  accessTokenRefreshHandler = handler;
}

function isAuthRecoveryRequest(url?: string) {
  if (!url) return false;

  const pathname = new URL(url, 'http://hirelink.local').pathname;

  return (
    pathname === '/auth/login' ||
    pathname === '/auth/csrf' ||
    pathname === '/auth/refresh' ||
    pathname === '/api/auth/login' ||
    pathname === '/api/auth/csrf' ||
    pathname === '/api/auth/refresh'
  );
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  const request = config as RetryableRequestConfig;

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
    request._accessToken = accessToken;
  } else {
    request._accessToken = undefined;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const request = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      isAuthRecoveryRequest(request.url)
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      const currentAccessToken = getAccessToken();

      if (
        currentAccessToken &&
        request._accessToken &&
        currentAccessToken !== request._accessToken
      ) {
        return apiClient.request(request);
      }

      if (accessTokenRefreshHandler) {
        await accessTokenRefreshHandler();
      } else {
        await refreshSessionOnce();
      }

      return apiClient.request(request);
    } catch {
      return Promise.reject(error);
    }
  },
);

export { apiClient, registerAccessTokenRefreshHandler };
export default apiClient;
