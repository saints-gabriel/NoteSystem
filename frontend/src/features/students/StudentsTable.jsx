import { ChevronRight, Clock3 } from "lucide-react";
import { Avatar, Badge, ProgressBar } from "../../components/ui/index.js";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { statusTone } from "./studentStatus.js";

export function StudentsTable({ students }) {
  const { openStudent } = useWorkspaceUi();
  return (
    <div className="responsive-table">
      <table>
        <thead>
          <tr>
            <th>ALUNO</th>
            <th>CURSO / NÍVEL</th>
            <th>PROFESSOR</th>
            <th>FREQUÊNCIA</th>
            <th>STATUS</th>
            <th>PRÓXIMA AULA</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <button className="person-cell" onClick={() => openStudent(student)}>
                  <Avatar student={student} />
                  <span>
                    <strong>{student.name}</strong>
                    <small>{student.email}</small>
                  </span>
                </button>
              </td>
              <td>
                <strong className="table-primary">{student.course}</strong>
                <small>{student.level}</small>
              </td>
              <td>{student.teacher}</td>
              <td>
                <div className="attendance-cell">
                  <span>{student.attendance}%</span>
                  <ProgressBar value={student.attendance} tone={student.attendance < 75 ? "red" : "green"} />
                </div>
              </td>
              <td>
                <Badge tone={statusTone(student.status)} dot>
                  {student.status}
                </Badge>
              </td>
              <td>
                <span className="next-class">
                  <Clock3 size={14} />
                  {student.nextClass}
                </span>
              </td>
              <td>
                <button
                  className="icon-button"
                  onClick={() => openStudent(student)}
                  aria-label={`Detalhes de ${student.name}`}
                >
                  <ChevronRight size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
