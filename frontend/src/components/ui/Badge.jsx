export function Badge({ children, tone = "neutral", dot = false }) {
  return (
    <span className={`badge badge-${tone}`}>
      {dot && <i />}
      {children}
    </span>
  );
}
