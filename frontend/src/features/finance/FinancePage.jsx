import { useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3, CreditCard, Plus, Target } from "lucide-react";
import { RevenueChart } from "../../components/charts/RevenueChart.jsx";
import { AsyncContent, Badge, PageTitle, ProgressBar } from "../../components/ui/index.js";
import { useResource } from "../../context/ResourceContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { getFinanceSummary } from "../../services/financeService.js";
import { currentMonthKey } from "../../utils/dates.js";
import { formatCurrency, formatDelta, formatMonthLong } from "../../utils/format.js";
import { TransactionsTable } from "./TransactionsTable.jsx";

export function FinancePage() {
  const transactions = useResource("transactions");
  const { openForm } = useWorkspaceUi();
  const { showToast } = useToast();
  const [month, setMonth] = useState(currentMonthKey);
  // Recalcula o resumo quando uma cobrança é criada ou baixada.
  const summary = useAsync(() => getFinanceSummary(month), [month, transactions.items]);

  const markPaid = async (id) => {
    try {
      await transactions.update(id, { status: "Pago" });
      showToast("Pagamento baixado com sucesso.");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const monthItems = useMemo(
    () =>
      transactions.items
        .filter((item) => item.due?.startsWith(month))
        .sort((a, b) => b.due.localeCompare(a.due)),
    [transactions.items, month],
  );

  return (
    <div className="view">
      <PageTitle
        eyebrow={`FINANCEIRO / ${formatMonthLong(month).toUpperCase()}`}
        title="Fluxo financeiro"
        description="Receita previsível, cobranças organizadas e decisões mais claras."
        actions={
          <button className="button button-primary" onClick={() => openForm("new-payment")}>
            <Plus size={17} />
            Nova cobrança
          </button>
        }
      />
      <AsyncContent query={summary}>
        {(data) => (
          <>
            <FinanceStats summary={data} />
            <div className="finance-layout">
              <section className="panel">
                <header className="panel-header">
                  <div>
                    <span className="panel-kicker">RECEITA / 12 MESES</span>
                    <h2>Desempenho financeiro</h2>
                  </div>
                  <Badge tone={data.goalProgress >= 100 ? "green" : "yellow"}>
                    META {data.goalProgress}%
                  </Badge>
                </header>
                <RevenueChart series={data.series} compact />
              </section>
              <CollectionPanel summary={data} />
            </div>
            <section className="panel table-panel">
              <AsyncContent query={transactions}>
                <TransactionsTable
                  items={monthItems}
                  months={data.months}
                  month={month}
                  onMonthChange={setMonth}
                  onMarkPaid={markPaid}
                />
              </AsyncContent>
            </section>
          </>
        )}
      </AsyncContent>
    </div>
  );
}

function FinanceStats({ summary }) {
  const change = summary.previousReceived
    ? ((summary.received - summary.previousReceived) / summary.previousReceived) * 100
    : null;
  return (
    <section className="finance-stats">
      <article className="finance-balance border-glow-green">
        <span>
          <CheckCircle2 size={17} />
          RECEBIDO NO MÊS
        </span>
        <strong>{formatCurrency(summary.received)}</strong>
        <small>
          <ArrowUpRight size={14} />
          {change === null
            ? "Sem base de comparação com o mês anterior"
            : `${formatDelta(change)} em relação ao mês anterior`}
        </small>
      </article>
      <article>
        <span>
          <Clock3 size={17} />A RECEBER
        </span>
        <strong>{formatCurrency(summary.pendingAmount)}</strong>
        <small>{summary.pendingCount} cobranças pendentes</small>
      </article>
      <article className="border-glow-red">
        <span>
          <AlertTriangle size={17} />
          EM ATRASO
        </span>
        <strong>{formatCurrency(summary.overdueAmount)}</strong>
        <small>{summary.overdueCount} cobranças vencidas</small>
      </article>
    </section>
  );
}

function CollectionPanel({ summary }) {
  return (
    <section className="panel collection-panel">
      <span className="panel-kicker">EFICIÊNCIA DE RECEBIMENTO</span>
      <div className="collection-score">
        <strong>
          {summary.collectionRate}
          <span>%</span>
        </strong>
        <Target size={34} />
      </div>
      <ProgressBar value={summary.collectionRate} tone="green" />
      <p>Parcela do valor cobrado no mês que já foi recebida. O índice ideal para a escola é acima de 90%.</p>
      <div className="collection-split">
        {summary.methodSplit.length ? (
          summary.methodSplit.map((item) => (
            <span key={item.method}>
              {item.method} <b>{item.percent}%</b>
            </span>
          ))
        ) : (
          <span>
            <CreditCard size={14} /> Sem recebimentos no mês
          </span>
        )}
      </div>
    </section>
  );
}
