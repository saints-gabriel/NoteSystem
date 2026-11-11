import { CalendarDays, Guitar, MapPin, Mic2, Music2, Piano, Plus } from "lucide-react";
import { AsyncContent, Badge, PageTitle, ProgressBar } from "../../components/ui/index.js";
import { useResource } from "../../context/ResourceContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { getEnrollmentMix } from "../../services/reportService.js";
import { EnrollmentMix } from "./EnrollmentMix.jsx";

const ICONS = [Guitar, Music2, Piano, Mic2];

export function GroupsPage() {
  const groups = useResource("groups");
  const mix = useAsync(getEnrollmentMix, [groups.items]);
  const { openForm } = useWorkspaceUi();

  return (
    <div className="view">
      <PageTitle
        eyebrow="ACADÊMICO / ESTRUTURA"
        title="Turmas & cursos"
        description="Acompanhe ocupação, níveis e horários de cada formação."
        actions={
          <button className="button button-primary" onClick={() => openForm("new-group")}>
            <Plus size={17} />
            Nova turma
          </button>
        }
      />
      <AsyncContent query={groups}>
        <div className="group-grid">
          {groups.items.map((group, index) => (
            <GroupCard key={group.id} group={group} Icon={ICONS[index % ICONS.length]} />
          ))}
        </div>
      </AsyncContent>
      {mix.data && <EnrollmentMix mix={mix.data} />}
    </div>
  );
}

function GroupCard({ group, Icon }) {
  const occupancy = Math.round((group.students / group.capacity) * 100);
  const full = occupancy >= 100;
  return (
    <article className="panel group-card">
      <header>
        <span className="group-icon">
          <Icon size={23} />
        </span>
        <Badge tone={full ? "red" : occupancy >= 85 ? "yellow" : "green"} dot>
          {full ? "Lotada" : `${group.capacity - group.students} vagas`}
        </Badge>
      </header>
      <span className="panel-kicker">{group.course.toUpperCase()}</span>
      <h2>{group.name}</h2>
      <p>
        {group.level} · {group.teacher}
      </p>
      <div className="group-occupancy">
        <div>
          <span>Ocupação</span>
          <strong>
            {group.students}/{group.capacity} alunos
          </strong>
        </div>
        <ProgressBar value={occupancy} tone={full ? "red" : "yellow"} />
      </div>
      <footer>
        <span>
          <CalendarDays size={15} />
          {group.schedule || "Horário a definir"}
        </span>
        <span>
          <MapPin size={15} />
          {group.room || "Sala a definir"}
        </span>
      </footer>
    </article>
  );
}
