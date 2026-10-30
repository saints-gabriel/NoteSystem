import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Executa uma chamada assíncrona ao montar (e quando `deps` mudam).
 * Retorna { data, loading, error, reload }. Respostas antigas são descartadas.
 */
export function useAsync(request, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const latest = useRef(0);

  const run = useCallback(() => {
    const id = ++latest.current;
    setState((current) => ({ ...current, loading: true, error: null }));
    return request().then(
      (data) => id === latest.current && setState({ data, loading: false, error: null }),
      (error) => id === latest.current && setState((current) => ({ ...current, loading: false, error })),
    );
  }, deps);

  useEffect(() => {
    run();
    return () => {
      latest.current += 1;
    };
  }, [run]);

  return { ...state, reload: run };
}
