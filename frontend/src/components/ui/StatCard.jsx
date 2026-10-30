import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatDelta } from "../../utils/format.js";
import { Badge } from "./Badge.jsx";

/** `delta` é opcional: sem base de comparação, o selo de variação não é exibido. */
export function StatCard({ label, value, delta = null, icon: Icon, tone = "yellow", detail }) {
  const negative = delta !== null && delta < 0;
  return (
    <article className={`stat-card border-glow-${tone}`}>
      <div className="stat-top">
        <span className={`stat-icon text-${tone}`}>
          <Icon size={19} />
        </span>
        {delta !== null && (
          <Badge tone={negative ? "red" : "green"}>
            {negative ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
            {formatDelta(Math.abs(delta))}
          </Badge>
        )}
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-label">{label}</span>
      <div className="stat-detail">{detail}</div>
    </article>
  );
}
