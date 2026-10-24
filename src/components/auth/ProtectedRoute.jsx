import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "owner") {
      return <Navigate to="/owner" replace />;
    }

    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;