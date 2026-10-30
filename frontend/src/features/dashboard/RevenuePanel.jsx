import { Badge } from "../../components/ui/index.js";
import { RevenueChart } from "../../components/charts/RevenueChart.jsx";
import { formatCurrency, formatDelta } from "../../utils/format.js";

export function RevenuePanel({ revenue }) {
  const { growthPct } = revenue;
  return (
    <section className="panel revenue-panel">
      <header className="panel-header">
        <div>
          <span className="panel-kicker">PERFORMANCE / 12 MESES</span>
          <h2>Receita & crescimento</h2>
        </div>
        {growthPct !== null && (
          <Badge tone={growthPct < 0 ? "red" : "green"} dot>
            {formatDelta(growthPct)} vs mês anterior
          </Badge>
        )}
      </header>
      <div className="revenue-summary">
        <div>
          <small>RECEITA ACUMULADA</small>
          <strong>{formatCurrency(revenue.total)}</strong>
        </div>
        <div>
          <small>TICKET MÉDIO</small>
          <strong>{formatCurrency(revenue.averageTicket)}</strong>
        </div>
      </div>
      <RevenueChart series={revenue.series} />
    </section>
  );
}
