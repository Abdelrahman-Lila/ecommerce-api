import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthSession } from "../../features/auth/hooks/useAuthSession.js";

export function RequireAuth({ redirectTo = "/login" }) {
  const location = useLocation();
  const { isAuthenticated } = useAuthSession();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RequireAdmin({ redirectTo = "/" }) {
  const { role, isAuthenticated } = useAuthSession();

  if (!isAuthenticated || role !== "admin") {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export function RequireCustomer({ redirectTo = "/admin" }) {
  const { role, isAuthenticated } = useAuthSession();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin") {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute({ redirectTo = "/" }) {
  const { isAuthenticated } = useAuthSession();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
