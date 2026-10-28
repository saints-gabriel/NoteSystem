import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";

export function useApiData(fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reload = useCallback(async () => {
    setLoading(true);
    try { setData(await api.dashboard()); setError(null); }
    catch (requestError) { setError(requestError); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { data, setData, loading, error, reload };
}
