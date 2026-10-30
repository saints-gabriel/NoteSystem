import { useState } from "react";
import { ChevronRight, Download, Sparkles, Zap } from "lucide-react";
import { RevenueChart } from "../../components/charts/RevenueChart.jsx";
import { AsyncContent, Badge, PageTitle } from "../../components/ui/index.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { getReport } from "../../services/reportService.js";
import { downloadFile } from "../../utils/download.js";
import { formatCurrency, formatDelta, formatNumber, formatPercent } from "../../utils/format.js";
import { REPORT_PERIODS, REPORT_TYPES } from "./reportTypes.js";

const FORMATTERS = { number: formatNumber, percent: formatPercent, currency: formatCurrency };
const formatKpi = (kpi) => FORMATTERS[kpi.format](kpi.value);

export function ReportsPage() {
  const { showToast } = useToast();
  const [type, setType] = useState(REPORT_TYPES[0].id);
  const [period, setPeriod] = useState(REPORT_PERIODS[0].id);
  const query = useAsync(() => getReport(type, period), [type, period]);

  const typeInfo = REPORT_TYPES.find((item) => item.id === type);
  const periodLabel = REPORT_PERIODS.find((item) => item.id === period).label;

  const refresh = async () => {
    await query.reload();
    showToast(`${typeInfo.name} atualizado para ${periodLabel.toLowerCase()}.`);
  };

  const exportReport = () => {
    if (!query.data) return;
    const lines = [
      `Relatório;${typeInfo.name}`,
      `Período;${periodLabel}`,
      ...query.data.kpis.map((kpi) => `${kpi.label};${formatKpi(kpi)}`),
    ];
    downloadFile("relatorio-notesystem.csv", lines.join("\n"), "text/csv");
    showToast("Relatório exportado em CSV.");
  };

  return (
    <div className="view">
      <PageTitle
        eyebrow="INTELIGÊNCIA / RELATÓRIOS"
        title="Decisões com mais clareza"
        description="Transforme a rotina da escola em informação útil e acionável."
        actions={
          <button className="button button-secondary" onClick={exportReport} disabled={!query.data}>
            <Download size={16} />
            Exportar CSV
          </button>
        }
      />
      <div className="report-controls">
        <div className="report-types">
          {REPORT_TYPES.map((item) => (
            <button
              key={item.id}
              className={type === item.id ? "active" : ""}
              onClick={() => setType(item.id)}
            >
              <item.icon size={19} />
              <span>
                <strong>{item.name}</strong>
                <small>{item.desc}</small>
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
        <div className="period-control">
          <label>
            PERÍODO DE ANÁLISE
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              {REPORT_PERIODS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button className="button button-primary" onClick={refresh}>
            <Zap size={16} />
            Atualizar análise
          </button>
        </div>
      </div>
      <AsyncContent query={query}>
        {(report) => (
          <section className="panel executive-report">
            <header className="panel-header">
              <div>
                <span className="panel-kicker">{periodLabel.toUpperCase()} / NOTE ANALYTICS</span>
                <h2>{typeInfo.name}</h2>
              </div>
              <Badge tone="green" dot>
                Dados atualizados
              </Badge>
            </header>
            <div className="report-kpis">
              {report.kpis.map((kpi) => (
                <div key={kpi.key}>
                  <small>{kpi.label.toUpperCase()}</small>
                  <strong>{formatKpi(kpi)}</strong>
                  {kpi.delta !== null && (
                    <span className={kpi.delta >= 0 ? "positive" : "negative"}>{formatDelta(kpi.delta)}</span>
                  )}
                  {kpi.detail && <span> {kpi.detail}</span>}
                </div>
              ))}
            </div>
            <RevenueChart series={report.series} />
            <div className="report-conclusion">
              <Sparkles size={20} />
              <p>
                <strong>Leitura do período</strong>
                {report.conclusion}
              </p>
            </div>
          </section>
        )}
      </AsyncContent>
    </div>
  );
}
