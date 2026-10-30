import { useState } from "react";
import { BookOpenCheck, Music2, Plus } from "lucide-react";
import {
  Avatar,
  AsyncContent,
  Badge,
  EmptyState,
  PageTitle,
  ProgressBar,
} from "../../components/ui/index.js";
import { useResource } from "../../context/ResourceContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { combineQueries } from "../../hooks/combineQueries.js";
import { formatDate } from "../../utils/format.js";

const SKILLS = [
  { key: "technique", label: "Técnica instrumental", tone: "yellow" },
  { key: "reading", label: "Leitura musical", tone: "cyan" },
  { key: "rhythm", label: "Percepção rítmica", tone: "green" },
  { key: "repertoire", label: "Repertório", tone: "violet" },
];

export function PedagogyPage() {
  const students = useResource("students");
  const evaluations = useResource("evaluations");
  const { openForm } = useWorkspaceUi();
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="view">
      <PageTitle
        eyebrow="PEDAGÓGICO / EVOLUÇÃO"
        title="Acompanhamento que faz sentido"
        description="Repertório, frequência e avaliações em uma única partitura."
        actions={
          <button className="button button-primary" onClick={() => openForm("new-evaluation")}>
            <Plus size={17} />
            Nova avaliação
          </button>
        }
      />
      <AsyncContent query={combineQueries(students, evaluations)}>
        {([studentList, evaluationList]) => {
          const roster = studentList.filter((s) => s.status !== "Inativo");
          const selected = roster.find((s) => s.id === selectedId) ?? roster[0];
          if (!selected)
            return (
              <EmptyState title="Nenhum aluno ativo" text="Cadastre um aluno para acompanhar sua evolução." />
            );
          return (
            <div className="pedagogy-layout">
              <Roster roster={roster} selected={selected} onSelect={setSelectedId} />
              <StudentDevelopment
                student={selected}
                evaluations={evaluationList
                  .filter((e) => e.studentId === selected.id)
                  .sort((a, b) => String(b.date).localeCompare(String(a.date)))}
              />
            </div>
          );
        }}
      </AsyncContent>
    </div>
  );
}

function Roster({ roster, selected, onSelect }) {
  return (
    <section className="panel pedagogy-roster">
      <header>
        <span className="panel-kicker">ALUNOS / PROGRESSO</span>
        <h2>Turma individual</h2>
      </header>
      <div>
        {roster.map((student) => (
          <button
            key={student.id}
            className={selected.id === student.id ? "active" : ""}
            onClick={() => onSelect(student.id)}
          >
            <Avatar student={student} />
            <span>
              <strong>{student.name}</strong>
              <small>
                {student.course} · {student.level}
              </small>
              <ProgressBar value={student.progress} />
            </span>
            <b>{student.progress}%</b>
          </button>
        ))}
      </div>
    </section>
  );
}

function StudentDevelopment({ student, evaluations }) {
  const { repertoire, skills } = student;
  return (
    <section className="panel student-development">
      <header className="development-header">
        <div className="development-person">
          <Avatar student={student} size="lg" />
          <div>
            <span className="panel-kicker">PERFIL DE APRENDIZAGEM</span>
            <h2>{student.name}</h2>
            <p>
              {student.course} · {student.teacher}
            </p>
          </div>
        </div>
        <Badge tone="green" dot>
          {student.progress}% do plano
        </Badge>
      </header>
      {skills && (
        <div className="skill-grid">
          {SKILLS.map(({ key, label, tone }) => (
            <div key={key}>
              <span>{label}</span>
              <strong>{skills[key]}%</strong>
              <ProgressBar value={skills[key]} tone={tone} />
            </div>
          ))}
        </div>
      )}
      {repertoire && (
        <div className="repertoire-block">
          <span className="panel-kicker">REPERTÓRIO ATUAL</span>
          <div className="repertoire-item">
            <Music2 size={20} />
            <div>
              <strong>{repertoire.title}</strong>
              <small>
                {repertoire.nextPresentation
                  ? `Próxima apresentação ${formatDate(repertoire.nextPresentation)}`
                  : "Sem apresentação marcada"}
              </small>
            </div>
            <Badge tone="yellow">{repertoire.status.toUpperCase()}</Badge>
          </div>
        </div>
      )}
      <div className="evaluation-block">
        <div className="section-inline-title">
          <span className="panel-kicker">AVALIAÇÕES RECENTES</span>
          <span>{evaluations.length} registros</span>
        </div>
        {evaluations.length ? (
          evaluations.map((evaluation) => (
            <article className="evaluation-item" key={evaluation.id}>
              <div className="evaluation-score">{Number(evaluation.score).toFixed(1)}</div>
              <div>
                <strong>{evaluation.title}</strong>
                <p>{evaluation.note}</p>
                <small>{formatDate(evaluation.date)}</small>
              </div>
            </article>
          ))
        ) : (
          <EmptyState
            icon={BookOpenCheck}
            title="Sem avaliações ainda"
            text="Registre a primeira avaliação deste aluno para acompanhar sua evolução."
          />
        )}
      </div>
    </section>
  );
}
