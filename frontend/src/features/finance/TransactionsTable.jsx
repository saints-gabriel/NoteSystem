import { useState } from "react";
import { Check, CheckCircle2, CreditCard } from "lucide-react";
import { Badge, EmptyState } from "../../components/ui/index.js";
import { formatCurrency, formatDate, formatMonthLong } from "../../utils/format.js";

const FILTERS = ["Todos", "Pago", "Pendente", "Atrasado"];
const statusTone = (status) => (status === "Pago" ? "green" : status === "Atrasado" ? "red" : "yellow");

export function TransactionsTable({ items, months, month, onMonthChange, onMarkPaid }) {
  const [filter, setFilter] = useState("Todos");
  const filtered = filter === "Todos" ? items : items.filter((item) => item.status === filter);

  return (
    <>
      <div className="table-toolbar">
        <div>
          <span className="panel-kicker">TRANSAÇÕES DO PERÍODO</span>
          <h2>Mensalidades</h2>
        </div>
        <div className="filter-group">
          <select value={month} onChange={(e) => onMonthChange(e.target.value)} aria-label="Filtrar por mês">
            {months.map((key) => (
              <option key={key} value={key}>
                {formatMonthLong(key)}
              </option>
            ))}
          </select>
          <div className="segmented-control">
            {FILTERS.map((name) => (
              <button key={name} className={filter === name ? "active" : ""} onClick={() => setFilter(name)}>
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {filtered.length ? (
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>ALUNO / DESCRIÇÃO</th>
                <th>VENCIMENTO</th>
                <th>VALOR</th>
                <th>MÉTODO</th>
                <th>STATUS</th>
                <th>AÇÃO</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong className="table-primary">{item.student}</strong>
                    <small>{item.description}</small>
                  </td>
                  <td>{formatDate(item.due)}</td>
                  <td>
                    <strong>{formatCurrency(item.amount)}</strong>
                  </td>
                  <td>{item.method}</td>
                  <td>
                    <Badge tone={statusTone(item.status)} dot>
                      {item.status}
                    </Badge>
                  </td>
                  <td>
                    {item.status !== "Pago" ? (
                      <button
                        className="button button-ghost button-small"
                        onClick={() => onMarkPaid(item.id)}
                      >
                        <Check size={14} />
                        Baixar
                      </button>
                    ) : (
                      <span className="paid-check">
                        <CheckCircle2 size={17} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={CreditCard}
          title="Nenhuma cobrança"
          text="Não há transações com este filtro no período."
        />
      )}
    </>
  );
}
