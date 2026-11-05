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

export interface AccessTokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginResponse extends AccessTokenResponse {
  role: UserRole;
  userId: number;
}

export type SignupResponse = AccessTokenResponse;

export type RefreshAccessTokenResponse = AccessTokenResponse;

export interface CsrfTokenResponse {
  headerName: string;
  token: string;
}

export type CsrfResponse = CsrfTokenResponse;
export type RefreshResponse = AccessTokenResponse;

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

export interface ApiErrorResponse {
  code: string;
  message: string;
}

export interface AuthenticatedUser {
  userId: number;
  role: UserRole;
}
