import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { UserRole } from "../../types/auth";

function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole?: UserRole;
}) {
  const location = useLocation();
  const { currentUser, isAuthenticated, isAuthInitializing } = useAuth();

  if (isAuthInitializing) {
    return (
      <div className="min-h-screen bg-white" aria-busy="true">
        <span className="sr-only">로그인 상태 확인 중</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/employer/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (requiredRole && currentUser && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
