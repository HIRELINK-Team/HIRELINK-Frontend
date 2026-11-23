import { publicApiClient } from './baseClient';
import { getAuthCsrfToken } from './student/auth';

import type {
  PhoneVerificationConfirmRequest,
  PhoneVerificationRequest,
  PhoneVerificationResponse,
  SocialAuthResponse,
  SocialProvider,
  SocialSignupResponse,
} from '../types/auth';
import type {
  SocialSignupTermsRequest,
  SocialSignupTermsResponse,
} from '../types/socialTerms';
import type {
  SocialRegistrationFrontResponse,
  SocialRegistrationVerificationResponse,
} from '../types/socialRegistration';

const SOCIAL_AUTH_PENDING_KEY = 'student.socialAuthPending';
const SOCIAL_SIGNUP_KEY = 'student.socialSignup';
let socialResultPromise: Promise<SocialAuthResponse> | null = null;

export function startStudentSocialLogin(provider: SocialProvider) {
  sessionStorage.removeItem(SOCIAL_SIGNUP_KEY);
  sessionStorage.setItem(SOCIAL_AUTH_PENDING_KEY, 'true');
  window.location.assign(`/api/auth/social/${provider}?role=STUDENT`);
}

export function markStudentSocialSignup() {
  sessionStorage.setItem(SOCIAL_SIGNUP_KEY, 'true');
}

export function hasStudentSocialSignup() {
  return sessionStorage.getItem(SOCIAL_SIGNUP_KEY) === 'true';
}

export function clearStudentSocialSignup() {
  sessionStorage.removeItem(SOCIAL_SIGNUP_KEY);
}

export async function getStudentSocialSignupTerms(): Promise<SocialSignupTermsResponse> {
  const { data } =
    await publicApiClient.get<SocialSignupTermsResponse>('/auth/social/terms');
  return data;
}

export async function saveStudentSocialSignupTerms(
  request: SocialSignupTermsRequest,
): Promise<SocialSignupTermsResponse> {
  const { headerName, token } = await getAuthCsrfToken();
  const { data } = await publicApiClient.put<SocialSignupTermsResponse>(
    '/auth/social/terms',
    request,
    { headers: { [headerName]: token } },
  );
  return data;
}

export async function requestSocialPhoneVerification(
  request: PhoneVerificationRequest,
): Promise<PhoneVerificationResponse> {
  const { headerName, token } = await getAuthCsrfToken();
  const { data } = await publicApiClient.post<PhoneVerificationResponse>(
    '/auth/social/phone-verifications',
    request,
    { headers: { [headerName]: token } },
  );
  return data;
}

export async function confirmSocialPhoneVerification(
  request: PhoneVerificationConfirmRequest,
): Promise<SocialSignupResponse> {
  const { headerName, token } = await getAuthCsrfToken();
  const { data } = await publicApiClient.post<SocialSignupResponse>(
    '/auth/social/phone-verifications/verify',
    request,
    { headers: { [headerName]: token } },
  );
  return data;
}

async function submitSocialRegistrationFile<T>(
  path: string,
  field: 'registrationFile' | 'stayDocument',
  file: File,
): Promise<T> {
  const { headerName, token } = await getAuthCsrfToken();
  const form = new FormData();
  form.append(field, file);
  const { data } = await publicApiClient.post<T>(path, form, {
    headers: { [headerName]: token },
  });
  return data;
}

export function verifySocialRegistrationFront(file: File) {
  return submitSocialRegistrationFile<SocialRegistrationFrontResponse>(
    '/auth/social/registration/front',
    'registrationFile',
    file,
  );
}

export function verifySocialRegistrationBack(file: File) {
  return submitSocialRegistrationFile<SocialRegistrationVerificationResponse>(
    '/auth/social/registration/back',
    'registrationFile',
    file,
  );
}

export function verifySocialStayDocument(file: File) {
  return submitSocialRegistrationFile<SocialRegistrationVerificationResponse>(
    '/auth/social/registration/stay-document',
    'stayDocument',
    file,
  );
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
