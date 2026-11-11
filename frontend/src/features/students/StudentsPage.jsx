import { useMemo, useState } from "react";
import { Download, Filter, Plus, Search, X } from "lucide-react";
import { AsyncContent, EmptyState, PageTitle } from "../../components/ui/index.js";
import { useResource } from "../../context/ResourceContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { downloadFile } from "../../utils/download.js";
import { StudentsTable } from "./StudentsTable.jsx";
import { STUDENT_STATUSES } from "./studentStatus.js";

const ALL = "Todos";

function exportCsv(students) {
  const rows = students.map((s) => `${s.name};${s.course};${s.teacher};${s.status};${s.attendance}%`);
  downloadFile(
    "alunos-notesystem.csv",
    ["Nome;Curso;Professor;Status;Frequência", ...rows].join("\n"),
    "text/csv",
  );
}

export function StudentsPage() {
  const students = useResource("students");
  const { openForm } = useWorkspaceUi();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ALL);
  const [course, setCourse] = useState(ALL);

  const courses = useMemo(() => [...new Set(students.items.map((s) => s.course))], [students.items]);
  const filtered = students.items.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) &&
      (status === ALL || s.status === status) &&
      (course === ALL || s.course === course),
  );
  const clearFilters = () => {
    setQuery("");
    setCourse(ALL);
    setStatus(ALL);
  };

  const activeCount = students.items.filter((s) => s.status === "Ativo").length;

  return (
    <div className="view">
      <PageTitle
        eyebrow="GESTÃO / MATRÍCULAS"
        title="Alunos"
        description={`${students.items.length} matrículas · ${activeCount} ativas agora`}
        actions={
          <>
            <button className="button button-secondary" onClick={() => exportCsv(students.items)}>
              <Download size={16} />
              Exportar
            </button>
            <button className="button button-primary" onClick={() => openForm("new-student")}>
              <Plus size={17} />
              Novo aluno
            </button>
          </>
        }
      />
      <AsyncContent query={students}>
        <section className="panel table-panel">
          <div className="table-toolbar">
            <label className="inline-search">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome do aluno..."
                aria-label="Buscar alunos"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Limpar busca">
                  <X size={15} />
                </button>
              )}
            </label>
            <div className="filter-group">
              <Filter size={16} />
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                aria-label="Filtrar por curso"
              >
                <option>{ALL}</option>
                {courses.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filtrar por status"
              >
                {[ALL, ...STUDENT_STATUSES].map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>
          {filtered.length ? (
            <StudentsTable students={filtered} />
          ) : (
            <EmptyState
              title="Nenhum aluno encontrado"
              text="Ajuste os filtros ou cadastre uma nova matrícula."
              action={
                <button className="button button-secondary" onClick={clearFilters}>
                  Limpar filtros
                </button>
              }
            />
          )}
          <footer className="table-footer">
            <span>
              Exibindo <strong>{filtered.length}</strong> de {students.items.length} alunos
            </span>
            <span>Dados sincronizados com a API</span>
          </footer>
        </section>
      </AsyncContent>
    </div>
  );
}
