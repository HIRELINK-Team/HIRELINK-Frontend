export type UserRole = 'STUDENT' | 'EMPLOYER';

export interface EmailLoginRequest {
  email: string;
  password: string;
}

export type LoginRequest = EmailLoginRequest;

export interface EmailSignupRequest {
  email: string;
  password: string;
  role: UserRole;
}

export type SignupRequest = EmailSignupRequest;

export interface AccessTokenResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface LoginResponse extends AccessTokenResponse {
  role: UserRole;
  userId: number;
}

export type SocialProvider = 'google' | 'kakao';

export type SocialAuthResponse = {
  status: 'LOGIN' | 'SIGNUP_REQUIRED';
  role: UserRole;
  email: string | null;
  signupExpiresAt: string | null;
  login: LoginResponse | null;
};

export interface SocialSignupResponse extends AccessTokenResponse {
  userId: number;
  role: UserRole;
  onboardingRequired: boolean;
}

export interface SignupResponse extends AccessTokenResponse {
  email: string;
  role: UserRole;
  userId: number;
}

export type RefreshAccessTokenResponse = AccessTokenResponse;
export type RefreshResponse = AccessTokenResponse;

export interface CsrfTokenResponse {
  headerName: string;
  token: string;
}

export type CsrfResponse = CsrfTokenResponse;

export interface LogoutResponse {
  message: string;
}

export interface PhoneVerificationRequest {
  phoneNumber: string;
}

export interface PhoneVerificationResponse {
  expiresIn: number;
  message: string;
}

export interface PhoneVerificationConfirmRequest {
  phoneNumber: string;
  code: string;
}

export interface PhoneVerificationConfirmResponse {
  phoneNumber: string;
  verifiedAt: string;
  message: string;
}

export type RequestPhoneVerificationRequest = PhoneVerificationRequest;
export type RequestPhoneVerificationResponse = PhoneVerificationResponse;

export type VerifyPhoneRequest = PhoneVerificationConfirmRequest;
export type VerifyPhoneResponse = PhoneVerificationConfirmResponse;

export interface ApiErrorResponse {
  code: string;
  message: string;
}

export interface AuthenticatedUser {
  userId: number;
  role: UserRole;
}
