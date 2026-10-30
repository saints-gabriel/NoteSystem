import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService.js";
import { onUnauthorized } from "../services/httpClient.js";
import { clearToken, getStoredUser, getToken } from "../services/tokenStorage.js";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [checking, setChecking] = useState(() => Boolean(getToken()));

  useEffect(() => onUnauthorized(() => setUser(null)), []);

  // Confirma o token armazenado junto à API ao abrir o app.
  useEffect(() => {
    if (!getToken()) return;
    let active = true;
    authService
      .fetchCurrentUser()
      .then((current) => active && setUser(current))
      .catch((error) => active && error.status === 401 && setUser(null))
      .finally(() => active && setChecking(false));
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (credentials) => {
    const current = await authService.login(credentials);
    setUser(current);
    return current;
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, checking, signIn, signOut }), [user, checking, signIn, signOut]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession deve ser usado dentro de <SessionProvider>.");
  return context;
}
