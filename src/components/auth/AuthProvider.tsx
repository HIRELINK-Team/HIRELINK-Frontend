import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { login as requestLogin, logout as requestLogout } from "../../api/auth";
import {
  invalidateAuthSession,
  setAccessToken,
  subscribeToAuthInvalidation,
} from "../../api/accessToken";
import { initializeAuthSession } from "../../api/authSession";
import { AuthContext } from "../../hooks/useAuth";
import type { AuthenticatedUser, LoginRequest } from "../../types/auth";

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

  const login = useCallback(async (request: LoginRequest) => {
    const response = await requestLogin(request);
    setAccessToken(response.accessToken);
    setCurrentUser({ userId: response.userId, role: response.role });
    setIsAuthenticated(true);
    setIsAuthInitializing(false);
    return response;
  }, []);

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
      logout,
    }),
    [currentUser, isAuthenticated, isAuthInitializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
