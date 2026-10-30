import { Plus } from "lucide-react";
import { Badge } from "./Badge.jsx";
import { EmptyState } from "./EmptyState.jsx";
import { PageTitle } from "./PageTitle.jsx";

/**
 * Página-padrão dos módulos: título, ação principal e grade de cartões.
 * `items`: [{ id, title, text, meta, badge? }]
 */
export function ModulePage({ eyebrow, title, description, icon: Icon, items, action, kicker, heading }) {
  return (
    <div className="view">
      <PageTitle
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          action && (
            <button className="button button-primary" onClick={action.onClick}>
              <Plus size={16} />
              {action.label}
            </button>
          )
        }
      />
      <section className="panel table-panel">
        <header className="panel-header">
          <div>
            <span className="panel-kicker">{kicker ?? "CENTRAL DE OPERAÇÕES"}</span>
            <h2>{heading ?? `${items.length} registros`}</h2>
          </div>
          <Icon size={25} />
        </header>
        {items.length ? (
          <div className="group-grid">
            {items.map((item) => (
              <article className="panel group-card" key={item.id ?? item.title}>
                <header>
                  <span className="group-icon">
                    <Icon size={22} />
                  </span>
                  <Badge tone={item.tone ?? "green"} dot>
                    {item.badge ?? "Ativo"}
                  </Badge>
                </header>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
                <footer>
                  <span>{item.meta}</span>
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="Nada por aqui ainda" text="Os registros cadastrados aparecerão neste painel." />
        )}
      </section>
    </div>
  );
}
