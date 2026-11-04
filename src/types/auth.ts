export type UserRole = "STUDENT" | "EMPLOYER";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  role: UserRole;
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

export interface CsrfResponse {
  headerName: string;
  token: string;
}

export interface RefreshResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

export interface LogoutResponse {
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
