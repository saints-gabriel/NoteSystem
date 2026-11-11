export function ProgressBar({ value, tone = "yellow", label }) {
  const width = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div className="progress-wrap" aria-label={label || `${width}%`}>
      <div className="progress-track">
        <span className={`progress-${tone}`} style={{ width: `${width}%` }} />
      </div>
      {label && <small>{label}</small>}
    </div>
  );
}
