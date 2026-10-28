import { useCallback, useEffect, useState } from "react";
import { api, getCurrentUser } from "../services/api.js";

export function useSession() {
  const [user, setUser] = useState(getCurrentUser);
  const [loading, setLoading] = useState(Boolean(user));
  const refresh = useCallback(async () => {
    if (!localStorage.getItem("notesystem-token")) { setUser(null); setLoading(false); return; }
    try { const result = await api.me(); setUser(result.user); }
    catch { localStorage.removeItem("notesystem-token"); setUser(null); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const logout = useCallback(() => { localStorage.removeItem("notesystem-token"); setUser(null); }, []);
  return { user, loading, logout, refresh };
}
