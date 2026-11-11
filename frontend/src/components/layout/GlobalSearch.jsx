import { useMemo, useRef, useState } from "react";
import { ArrowUpRight, Command, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { navItemsFor } from "../../config/navigation.js";
import { useResource } from "../../context/ResourceContext.jsx";
import { useSession } from "../../context/SessionContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { useKeydown } from "../../hooks/useKeydown.js";
import { EmptyState } from "../ui/index.js";

const MAX_STUDENT_RESULTS = 4;

export function GlobalSearch() {
  const { user } = useSession();
  const students = useResource("students");
  const { openStudent } = useWorkspaceUi();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useKeydown((event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      inputRef.current?.focus();
      setOpen(true);
    }
    if (event.key === "Escape") setOpen(false);
  });

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    const people = students.items
      .filter((s) => `${s.name} ${s.course}`.toLowerCase().includes(term))
      .slice(0, MAX_STUDENT_RESULTS)
      .map((s) => ({
        key: `student-${s.id}`,
        title: s.name,
        sub: `${s.course} · ${s.status}`,
        icon: Users,
        run: () => openStudent(s),
      }));
    const pages = navItemsFor(user.role)
      .filter((item) => item.label.toLowerCase().includes(term))
      .map((item) => ({
        key: `page-${item.id}`,
        title: item.label,
        sub: "Ir para módulo",
        icon: item.icon,
        run: () => navigate(`/${item.id}`),
      }));
    return [...people, ...pages];
  }, [query, students.items, user.role, openStudent, navigate]);

  const choose = (result) => {
    result.run();
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="global-search">
      <Search size={17} />
      <input
        ref={inputRef}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        placeholder="Buscar em todo o sistema..."
        aria-label="Busca global"
      />
      <kbd>
        <Command size={12} />K
      </kbd>
      {open && query && (
        <div className="search-results">
          {results.length ? (
            results.map((result) => (
              <button key={result.key} onClick={() => choose(result)}>
                <result.icon size={17} />
                <span>
                  <strong>{result.title}</strong>
                  <small>{result.sub}</small>
                </span>
                <ArrowUpRight size={15} />
              </button>
            ))
          ) : (
            <EmptyState title="Sem resultados" text="Tente buscar por outro nome ou módulo." />
          )}
        </div>
      )}
    </div>
  );
}
