import { Navigate, Outlet } from "react-router-dom";
import { LoadingState } from "../components/ui/index.js";
import { homePathFor } from "../config/roles.js";
import { useSession } from "../context/SessionContext.jsx";

/** Protege rotas: exige login e, opcionalmente, um dos papéis informados. */
export function RoleRoute({ roles, children }) {
  const { user, checking } = useSession();
  if (checking) return <LoadingState label="VERIFICANDO SESSÃO" />;
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homePathFor(user.role)} replace />;
  return children ?? <Outlet />;
}
