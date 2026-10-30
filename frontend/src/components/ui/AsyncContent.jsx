import { AlertTriangle } from "lucide-react";
import { EmptyState } from "./EmptyState.jsx";

export function LoadingState({ label = "CARREGANDO DADOS" }) {
  return (
    <div className="loading-state" role="status">
      <span className="loading-spinner" />
      {label}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="error-state">
      <EmptyState
        icon={AlertTriangle}
        title="Não foi possível carregar os dados"
        text={error?.message || "Tente novamente em instantes."}
        action={
          onRetry && (
            <button className="button button-secondary" onClick={onRetry}>
              Tentar novamente
            </button>
          )
        }
      />
    </div>
  );
}

/**
 * Renderiza carregamento/erro enquanto não há dados. Aceita o retorno de
 * `useAsync`, `useResource` ou `combineQueries`; `children` pode ser uma
 * função que recebe os dados.
 */
export function AsyncContent({ query, children }) {
  const { data, loading, error, reload } = query;
  if (!data && error) return <ErrorState error={error} onRetry={reload} />;
  if (!data && loading) return <LoadingState />;
  if (!data) return null;
  return typeof children === "function" ? children(data) : children;
}
