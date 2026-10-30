import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, ProgressBar } from "../../components/ui/index.js";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";

export function FeaturedStudents({ students }) {
  const navigate = useNavigate();
  const { openStudent } = useWorkspaceUi();
  return (
    <section className="panel students-preview">
      <header className="panel-header">
        <div>
          <span className="panel-kicker">ACOMPANHAMENTO</span>
          <h2>Alunos em destaque</h2>
        </div>
        <button
          className="icon-button"
          onClick={() => navigate("/students")}
          aria-label="Ver todos os alunos"
        >
          <ArrowUpRight size={18} />
        </button>
      </header>
      <div className="student-highlight-list">
        {students.map((student) => (
          <button key={student.id} onClick={() => openStudent(student)} className="student-highlight">
            <Avatar student={student} />
            <div>
              <strong>{student.name}</strong>
              <small>
                {student.course} · {student.level}
              </small>
            </div>
            <div className="highlight-progress">
              <span>{student.progress}%</span>
              <ProgressBar value={student.progress} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
