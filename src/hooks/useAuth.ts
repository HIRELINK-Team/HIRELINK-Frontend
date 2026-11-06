import { createContext, useContext } from 'react';
import type {
  AuthenticatedUser,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '../types/auth';

interface AuthContextValue {
  currentUser: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isAuthInitializing: boolean;
  login: (request: LoginRequest) => Promise<LoginResponse>;
  signup: (request: SignupRequest) => Promise<SignupResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

export { AuthContext, useAuth };
