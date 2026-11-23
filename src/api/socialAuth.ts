import { publicApiClient } from './baseClient';
import { getAuthCsrfToken } from './student/auth';

import type { SocialAuthResponse, SocialProvider } from '../types/auth';

const SOCIAL_AUTH_PENDING_KEY = 'student.socialAuthPending';
let socialResultPromise: Promise<SocialAuthResponse> | null = null;

export function startStudentSocialLogin(provider: SocialProvider) {
  sessionStorage.setItem(SOCIAL_AUTH_PENDING_KEY, 'true');
  window.location.assign(`/api/auth/social/${provider}?role=STUDENT`);
}

export function hasPendingStudentSocialLogin() {
  return sessionStorage.getItem(SOCIAL_AUTH_PENDING_KEY) === 'true';
}

export function clearPendingStudentSocialLogin() {
  sessionStorage.removeItem(SOCIAL_AUTH_PENDING_KEY);
  socialResultPromise = null;
}

export function getSocialAuthResult() {
  socialResultPromise ??= getAuthCsrfToken().then(
    async ({ headerName, token }) => {
      const { data } = await publicApiClient.post<SocialAuthResponse>(
        '/auth/social/result',
        undefined,
        { headers: { [headerName]: token } },
      );
      return data;
    },
  );
  return socialResultPromise;
}
