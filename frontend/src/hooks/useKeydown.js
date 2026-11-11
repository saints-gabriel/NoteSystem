import { useEffect, useRef } from "react";

/** Registra um atalho global de teclado; o handler pode mudar sem re-registrar o listener. */
export function useKeydown(handler) {
  const latest = useRef(handler);
  latest.current = handler;

  useEffect(() => {
    const listener = (event) => latest.current(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
}
