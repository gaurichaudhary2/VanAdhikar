import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: "citizen" | "officer";
}

function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("vanadhikar_token");
  const userData = localStorage.getItem("vanadhikar_user");

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userData);

    if (
      allowedRole &&
      allowedRole === "officer" &&
      !["DISTRICT_OFFICER", "STATE_OFFICER", "ADMIN"].includes(
        user.role
      )
    ) {
      return <Navigate to="/citizen" replace />;
    }

    if (
      allowedRole &&
      allowedRole === "citizen" &&
      ["DISTRICT_OFFICER", "STATE_OFFICER", "ADMIN"].includes(
        user.role
      )
    ) {
      return <Navigate to="/officer" replace />;
    }

    return <>{children}</>;
  } catch {
    localStorage.removeItem("vanadhikar_token");
    localStorage.removeItem("vanadhikar_user");

    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;