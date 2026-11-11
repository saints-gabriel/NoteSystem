const COLORS = ["var(--accent)", "var(--primitive-cyan)", "var(--primitive-violet)"];
const DOT_CLASSES = ["dot-yellow", "dot-cyan", "dot-violet"];

function conicGradient(items) {
  let start = 0;
  const stops = items.map((item, index) => {
    const end = start + item.percent;
    const stop = `${COLORS[index % COLORS.length]} ${start}% ${end}%`;
    start = end;
    return stop;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

/** Distribuição das matrículas por tipo de formação, calculada pela API. */
export function EnrollmentMix({ mix }) {
  const [top] = [...mix.items].sort((a, b) => b.percent - a.percent);
  return (
    <section className="panel course-distribution">
      <div>
        <span className="panel-kicker">DISTRIBUIÇÃO / CURSOS</span>
        <h2>Uma escola, múltiplas sonoridades.</h2>
        {top && (
          <p>
            {top.label} representam {top.percent}% das matrículas ativas e vagas em turmas.
          </p>
        )}
      </div>
      <div className="distribution-visual">
        <div className="donut" style={{ background: mix.total ? conicGradient(mix.items) : undefined }}>
          <span>
            <strong>{mix.total}</strong>
            <small>MATRÍCULAS</small>
          </span>
        </div>
        <div className="distribution-legend">
          {mix.items.map((item, index) => (
            <span key={item.key}>
              <i className={DOT_CLASSES[index % DOT_CLASSES.length]} />
              {item.label} <b>{item.percent}%</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
