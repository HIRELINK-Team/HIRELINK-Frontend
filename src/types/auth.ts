export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface EmailSignupRequest {
  email: string;
  password: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
}

export interface CsrfTokenResponse {
  headerName: string;
  token: string;
}
