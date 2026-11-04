import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./baseClient";
import { getAccessToken } from "./accessToken";
import { refreshSessionOnce } from "./authSession";
import type { ApiErrorResponse } from "../types/auth";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _accessToken?: string;
}

const AUTH_RECOVERY_PATHS = ["/auth/login", "/auth/csrf", "/auth/refresh"];

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  const request = config as RetryableRequestConfig;

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
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
    const isAuthRecoveryRequest = AUTH_RECOVERY_PATHS.some((path) =>
      request?.url?.endsWith(path),
    );

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      isAuthRecoveryRequest
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

      await refreshSessionOnce();
      return apiClient.request(request);
    } catch {
      return Promise.reject(error);
    }
  },
);

export default apiClient;
