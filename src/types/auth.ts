export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
}
