import { BookOpenCheck, GraduationCap, Mail, Pencil, Phone, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, ProgressBar } from "../../components/ui/index.js";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { useKeydown } from "../../hooks/useKeydown.js";
import { statusTone } from "./studentStatus.js";

/** Painel lateral com o perfil do aluno selecionado (aberto via `openStudent`). */
export function StudentDrawer() {
  const { selectedStudent: student, closeStudent, openForm } = useWorkspaceUi();
  const navigate = useNavigate();
  useKeydown((event) => event.key === "Escape" && closeStudent());

  if (!student) return null;

  return (
    <>
      <button className="drawer-scrim" onClick={closeStudent} aria-label="Fechar detalhes" />
      <aside className="student-drawer">
        <header>
          <span className="eyebrow">
            <i />
            PERFIL / MATRÍCULA #{String(student.id).slice(-4)}
          </span>
          <button className="icon-button" onClick={closeStudent} aria-label="Fechar">
            <X size={19} />
          </button>
        </header>
        <div className="drawer-profile">
          <Avatar student={student} size="xl" />
          <h2>{student.name}</h2>
          <p>
            {student.course} · {student.level}
          </p>
          <Badge tone={statusTone(student.status)} dot>
            {student.status}
          </Badge>
        </div>
        <div className="drawer-stats">
          <div>
            <small>FREQUÊNCIA</small>
            <strong>{student.attendance}%</strong>
          </div>
          <div>
            <small>PROGRESSO</small>
            <strong>{student.progress}%</strong>
          </div>
          <div>
            <small>PRÓXIMA AULA</small>
            <strong className="small-value">{student.nextClass}</strong>
          </div>
        </div>
        <div className="drawer-section">
          <span className="panel-kicker">CONTATO</span>
          {student.email && (
            <a href={`mailto:${student.email}`}>
              <Mail size={16} />
              {student.email}
            </a>
          )}
          {student.phone && (
            <a href={`tel:${student.phone}`}>
              <Phone size={16} />
              {student.phone}
            </a>
          )}
        </div>
        <div className="drawer-section">
          <span className="panel-kicker">ACOMPANHAMENTO</span>
          <div className="drawer-progress">
            <span>
              Evolução no curso <b>{student.progress}%</b>
            </span>
            <ProgressBar value={student.progress} />
          </div>
          <div className="drawer-progress">
            <span>
              Frequência nas aulas <b>{student.attendance}%</b>
            </span>
            <ProgressBar value={student.attendance} tone="green" />
          </div>
        </div>
        <div className="drawer-section">
          <span className="panel-kicker">PROFESSOR RESPONSÁVEL</span>
          <div className="teacher-line">
            <GraduationCap size={18} />
            <strong>{student.teacher}</strong>
          </div>
        </div>
        <footer>
          <button
            className="button button-secondary"
            onClick={() => {
              closeStudent();
              navigate("/pedagogy");
            }}
          >
            <BookOpenCheck size={16} />
            Ver pedagógico
          </button>
          <button className="button button-primary" onClick={() => openForm("edit-student", student)}>
            <Pencil size={16} />
            Editar aluno
          </button>
        </footer>
      </aside>
    </>
  );
}
