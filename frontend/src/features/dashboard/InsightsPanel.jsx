import { ArrowRight, BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";

export function InsightsPanel({ insights }) {
  return (
    <aside className="panel ai-panel">
      <div className="ai-orb">
        <BrainCircuit size={26} />
        <i />
        <i />
      </div>
      <span className="panel-kicker">N.O.T.E. / INSIGHTS</span>
      <h2>Inteligência aplicada à sua escola.</h2>
      {insights.map((insight, index) => (
        <div className="ai-insight" key={insight.title}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>
            <strong>{insight.title}</strong>
            {insight.text}
          </p>
        </div>
      ))}
      <Link className="text-button" to="/reports">
        Explorar análise completa
        <ArrowRight size={15} />
      </Link>
    </aside>
  );
}
