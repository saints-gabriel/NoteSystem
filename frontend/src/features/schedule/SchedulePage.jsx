import { useState } from "react";
import { CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, MapPin, Plus } from "lucide-react";
import { AsyncContent, Badge, EmptyState, PageTitle } from "../../components/ui/index.js";
import { useResource } from "../../context/ResourceContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { weekDays, weekdayIndex } from "../../utils/dates.js";

const ALL = "Todos";
const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

const pad = (value) => String(value).padStart(2, "0");
const formatDay = ({ day, month }) => `${pad(day)} ${MONTHS[month]}`;

function weekLabel(days, weekOffset) {
  if (weekOffset === 0) return "SEMANA ATUAL";
  const count = Math.abs(weekOffset);
  return weekOffset < 0
    ? `${count} SEMANA${count > 1 ? "S" : ""} ATRÁS`
    : `${weekOffset} SEMANA${weekOffset > 1 ? "S" : ""} À FRENTE`;
}

/** A agenda é semanal e recorrente: as mesmas aulas se repetem em todas as semanas. */
export function SchedulePage() {
  const classes = useResource("classes");
  const teachers = useResource("teachers");
  const { openForm } = useWorkspaceUi();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(() => Math.min(weekdayIndex(), 5));
  const [teacher, setTeacher] = useState(ALL);

  const days = weekDays(weekOffset);
  const dayInfo = days[selectedDay];
  const visible = classes.items
    .filter((item) => item.day === selectedDay && (teacher === ALL || item.teacher === teacher))
    .sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="view">
      <PageTitle
        eyebrow="OPERAÇÃO / AGENDA"
        title="Agenda de aulas"
        description="Organize horários, professores e salas sem perder o ritmo."
        actions={
          <button className="button button-primary" onClick={() => openForm("new-class")}>
            <CalendarPlus size={17} />
            Agendar aula
          </button>
        }
      />
      <AsyncContent query={classes}>
        <section className="panel calendar-panel">
          <div className="calendar-toolbar">
            <div className="week-nav">
              <button
                className="icon-button"
                onClick={() => setWeekOffset((v) => v - 1)}
                aria-label="Semana anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button className="button button-ghost button-small" onClick={() => setWeekOffset(0)}>
                Hoje
              </button>
              <button
                className="icon-button"
                onClick={() => setWeekOffset((v) => v + 1)}
                aria-label="Próxima semana"
              >
                <ChevronRight size={18} />
              </button>
              <strong>
                {formatDay(days[0])} — {formatDay(days[5])} · {weekLabel(days, weekOffset)}
              </strong>
            </div>
            <select
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              aria-label="Filtrar professor"
            >
              <option>{ALL}</option>
              {teachers.items.map((item) => (
                <option key={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="week-strip">
            {days.map((day) => (
              <button
                key={day.short}
                className={selectedDay === day.index ? "selected" : ""}
                onClick={() => setSelectedDay(day.index)}
              >
                <span>{day.short}</span>
                <strong>{day.day}</strong>
                <i className={classes.items.some((item) => item.day === day.index) ? "has-events" : ""} />
              </button>
            ))}
          </div>
          <div className="schedule-content">
            <div className="day-heading">
              <div>
                <span className="panel-kicker">
                  {dayInfo.short} / {formatDay(dayInfo)}
                </span>
                <h2>
                  {visible.length} {visible.length === 1 ? "aula programada" : "aulas programadas"}
                </h2>
              </div>
              <div className="schedule-legend">
                <span>
                  <i className="legend-individual" />
                  Individual
                </span>
                <span>
                  <i className="legend-group" />
                  Coletiva
                </span>
              </div>
            </div>
            {visible.length ? (
              <div className="agenda-list">
                {visible.map((item) => (
                  <AgendaItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="Nenhuma aula neste dia"
                text="Não há aulas para os filtros selecionados. Aproveite para agendar uma nova aula."
                action={
                  <button className="button button-secondary" onClick={() => openForm("new-class")}>
                    <Plus size={16} />
                    Agendar aula
                  </button>
                }
              />
            )}
          </div>
        </section>
      </AsyncContent>
    </div>
  );
}

function AgendaItem({ item }) {
  const collective = item.type === "Coletiva";
  return (
    <article className={`agenda-item ${collective ? "agenda-group" : ""}`}>
      <div className="agenda-time">
        <strong>{item.start}</strong>
        <span>{item.end || "—"}</span>
      </div>
      <span className="agenda-line">
        <i />
      </span>
      <div className="agenda-main">
        <div>
          <Badge tone={collective ? "cyan" : "yellow"}>{item.type}</Badge>
          <h3>{item.student}</h3>
          <p>
            {item.course} · {item.teacher}
          </p>
        </div>
        <div className="agenda-meta">
          <span>
            <MapPin size={15} />
            {item.room || "Sala a definir"}
          </span>
          <Badge tone={item.status === "Confirmada" ? "green" : "yellow"} dot>
            {item.status}
          </Badge>
        </div>
      </div>
    </article>
  );
}
