import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";

export function usePortalData(user) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState(null);
  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try { setData(await api.portal()); setError(null); }
    catch (requestError) { setError(requestError); }
    finally { setLoading(false); }
  }, [user]);
  useEffect(() => { reload(); }, [reload]);
  return { data, loading, error, reload };
}
