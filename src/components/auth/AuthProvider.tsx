import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  login as requestLogin,
  logout as requestLogout,
  signup as requestSignup,
} from '../../api/auth';
import {
  invalidateAuthSession,
  setAccessToken,
  subscribeToAuthInvalidation,
} from '../../api/accessToken';
import { initializeAuthSession } from '../../api/authSession';
import { AuthContext } from '../../hooks/useAuth';
import type {
  AuthenticatedUser,
  LoginRequest,
  SignupRequest,
  UserRole,
} from '../../types/auth';

interface AuthSessionPayload {
  userId: number;
  role: UserRole;
  accessToken: string;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(
    null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);

  useEffect(() => {
    let isActive = true;

    const unsubscribe = subscribeToAuthInvalidation(() => {
      if (!isActive) return;
      setCurrentUser(null);
      setIsAuthenticated(false);
    });

    void initializeAuthSession().then((isSessionRestored) => {
      if (!isActive) return;
      setIsAuthenticated(isSessionRestored);
      setIsAuthInitializing(false);
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const applyAuthenticatedSession = useCallback(
    ({ userId, role, accessToken }: AuthSessionPayload) => {
      setAccessToken(accessToken);
      setCurrentUser({ userId, role });
      setIsAuthenticated(true);
      setIsAuthInitializing(false);
    },
    [],
  );

  const login = useCallback(
    async (request: LoginRequest) => {
      const response = await requestLogin(request);
      applyAuthenticatedSession(response);
      return response;
    },
    [applyAuthenticatedSession],
  );

  const signup = useCallback(
    async (request: SignupRequest) => {
      const response = await requestSignup(request);
      applyAuthenticatedSession(response);
      return response;
    },
    [applyAuthenticatedSession],
  );

  const logout = useCallback(async () => {
    await requestLogout();
    invalidateAuthSession();
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      isAuthInitializing,
      login,
      signup,
      logout,
    }),
    [currentUser, isAuthenticated, isAuthInitializing, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
