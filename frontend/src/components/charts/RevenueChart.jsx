import { useId } from "react";
import { formatMonthShort } from "../../utils/format.js";

const WIDTH = 720;
const PADDING = 22;

/** Gráfico de linha da receita mensal. `series`: [{ month: "2026-10", amount }]. */
export function RevenueChart({ series, compact = false }) {
  const gradientId = useId();
  const height = compact ? 180 : 250;
  const max = Math.max(...series.map((point) => point.amount), 1) * 1.1;
  const step = (WIDTH - PADDING * 2) / Math.max(series.length - 1, 1);

  const coordinates = series.map((point, index) => ({
    x: PADDING + index * step,
    y: height - PADDING - (point.amount / max) * (height - PADDING * 2),
  }));
  const line = coordinates.map(({ x, y }) => `${x},${y}`).join(" ");
  const area = `${PADDING},${height - PADDING} ${line} ${WIDTH - PADDING},${height - PADDING}`;
  const lastIndex = coordinates.length - 1;

  return (
    <div className="revenue-chart">
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label="Receita mensal dos últimos doze meses"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e8ff47" stopOpacity=".25" />
            <stop offset="1" stopColor="#e8ff47" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={PADDING}
            x2={WIDTH - PADDING}
            y1={height * ratio}
            y2={height * ratio}
            className="chart-grid"
          />
        ))}
        <polygon points={area} fill={`url(#${gradientId})`} />
        <polyline points={line} className="chart-line-shadow" />
        <polyline points={line} className="chart-line" />
        {coordinates.map(({ x, y }, index) => (
          <circle
            key={series[index].month}
            cx={x}
            cy={y}
            r={index === lastIndex ? 5 : 2.5}
            className={index === lastIndex ? "chart-dot active" : "chart-dot"}
          />
        ))}
      </svg>
      <div className="chart-months">
        {series.map((point) => (
          <span key={point.month}>{formatMonthShort(point.month)}</span>
        ))}
      </div>
    </div>
  );
}
