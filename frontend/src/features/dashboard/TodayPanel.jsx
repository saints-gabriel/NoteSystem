import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, EmptyState } from "../../components/ui/index.js";
import { formatWeekdayHeading } from "../../utils/format.js";

const VISIBLE_CLASSES = 4;

export function TodayPanel({ today, classes }) {
  const navigate = useNavigate();
  return (
    <section className="panel schedule-preview">
      <header className="panel-header">
        <div>
          <span className="panel-kicker">{formatWeekdayHeading(today.date)}</span>
          <h2>Aulas de hoje</h2>
        </div>
        <button className="button button-ghost button-small" onClick={() => navigate("/schedule")}>
          Ver agenda
          <ChevronRight size={15} />
        </button>
      </header>
      {classes.length ? (
        <div className="today-list">
          {classes.slice(0, VISIBLE_CLASSES).map((item) => (
            <button className="today-item" key={item.id} onClick={() => navigate("/schedule")}>
              <time>{item.start}</time>
              <span className="timeline-node" />
              <div>
                <strong>{item.student}</strong>
                <small>
                  {item.course} · {item.teacher}
                </small>
              </div>
              <Badge tone={item.status === "Pendente" ? "yellow" : "neutral"}>{item.room}</Badge>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState title="Sem aulas hoje" text="Não há aulas programadas para hoje." />
      )}
    </section>
  );
}
