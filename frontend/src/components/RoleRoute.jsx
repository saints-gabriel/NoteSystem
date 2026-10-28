import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/api.js";

export function RoleRoute({ roles, children }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/" replace />;
  if (!roles.includes(user.role)) return <Navigate to={user.role === "teacher" ? "/pedagogy-hub" : user.role === "student" ? "/student-home" : "/dashboard"} replace />;
  return children;
}
