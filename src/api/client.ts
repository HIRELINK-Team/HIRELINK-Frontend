import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

import { clearAccessToken, getAccessToken } from './accessToken';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const apiClient = axios.create({
  baseURL: apiBaseUrl || undefined,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type AccessTokenRefreshHandler = () => Promise<string>;

let accessTokenRefreshHandler: AccessTokenRefreshHandler | null = null;

export function registerAccessTokenRefreshHandler(
  handler: AccessTokenRefreshHandler,
) {
  accessTokenRefreshHandler = handler;
}

function isAuthRequest(url?: string) {
  if (!url) return false;

  const pathname = new URL(url, 'http://hirelink.local').pathname;
  return pathname.startsWith('/api/auth/');
}

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestConfig = error.config as RetryableRequestConfig | undefined;

    if (
      !requestConfig ||
      requestConfig._retry ||
      isAuthRequest(requestConfig.url)
    ) {
      return Promise.reject(error);
    }

    if (!accessTokenRefreshHandler) {
      return Promise.reject(error);
    }

    requestConfig._retry = true;

    try {
      const accessToken = await accessTokenRefreshHandler();
      const headers = AxiosHeaders.from(requestConfig.headers);

      headers.set('Authorization', `Bearer ${accessToken}`);
      requestConfig.headers = headers;

      return apiClient.request(requestConfig);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(refreshError);
    }
  },
);
