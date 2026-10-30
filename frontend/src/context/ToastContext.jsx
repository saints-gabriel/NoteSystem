import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

const ToastContext = createContext(null);
const TOAST_DURATION_MS = 3200;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((text, tone = "success") => setToast({ text, tone }), []);
  const dismiss = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(dismiss, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast, dismiss]);

  const value = useMemo(() => ({ showToast }), [showToast]);
  const Icon = toast?.tone === "error" ? AlertTriangle : CheckCircle2;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className={`toast toast-${toast.tone}`} role="status">
          <Icon size={19} />
          <span>{toast.text}</span>
          <button onClick={dismiss} aria-label="Fechar aviso">
            <X size={15} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast deve ser usado dentro de <ToastProvider>.");
  return context;
}
