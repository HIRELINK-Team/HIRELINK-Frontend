export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface EmailSignupRequest {
  email: string;
  password: string;
}

export interface AccessTokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginResponse extends AccessTokenResponse {
  role: 'STUDENT' | 'EMPLOYER';
  userId: number;
}

export type RefreshAccessTokenResponse = AccessTokenResponse;

export interface ApiErrorResponse {
  code: string;
  message: string;
}

export interface CsrfTokenResponse {
  headerName: string;
  token: string;
}
