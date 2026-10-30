import { CheckCircle2, GraduationCap, Megaphone, ShieldCheck, Users, WalletCards } from "lucide-react";
import { AsyncContent, ModulePage } from "../../components/ui/index.js";
import { useResource } from "../../context/ResourceContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { combineQueries } from "../../hooks/combineQueries.js";
import { useAsync } from "../../hooks/useAsync.js";
import { getPayouts } from "../../services/financeService.js";
import { formatCurrency, formatDate } from "../../utils/format.js";
import { statusTone } from "../students/studentStatus.js";
import { useBackupExport } from "../settings/useBackupExport.js";

const FEATURED_LIMIT = 6;

export function EnrollmentPage() {
  const students = useResource("students");
  const { openForm } = useWorkspaceUi();
  return (
    <AsyncContent query={students}>
      {(list) => (
        <ModulePage
          eyebrow="GESTÃO / MATRÍCULAS"
          title="Alunos e responsáveis"
          description="Centralize aluno, responsável legal e responsável financeiro."
          icon={Users}
          heading={`${list.length} matrículas`}
          items={list.slice(0, FEATURED_LIMIT).map((s) => ({
            id: s.id,
            title: s.name,
            text: `${s.course} · ${s.level}`,
            meta: s.email,
            badge: s.status,
            tone: statusTone(s.status),
          }))}
          action={{ label: "Nova matrícula", onClick: () => openForm("new-student") }}
        />
      )}
    </AsyncContent>
  );
}

export function CoursesPage() {
  const courses = useResource("courses");
  const rooms = useResource("rooms");
  const students = useResource("students");
  const { openForm } = useWorkspaceUi();
  return (
    <AsyncContent query={combineQueries(courses, rooms, students)}>
      {([courseList, roomList, studentList]) => (
        <ModulePage
          eyebrow="ACADÊMICO / ESTRUTURA"
          title="Cursos, turmas e salas"
          description="Organize capacidade, recursos e horários com detecção de conflito."
          icon={GraduationCap}
          heading={`${courseList.length} cursos · ${roomList.length} salas`}
          items={[
            ...courseList.map((c) => ({
              id: `course-${c.id}`,
              title: c.name,
              text: `${c.category} · ${formatCurrency(c.monthlyFee)}/mês`,
              meta: `${studentList.filter((s) => s.course === c.name && s.status !== "Inativo").length} alunos ativos`,
              badge: "Curso",
            })),
            ...roomList.map((r) => ({
              id: `room-${r.id}`,
              title: r.name,
              text: r.equipment,
              meta: `Capacidade: ${r.capacity}`,
              badge: "Sala",
              tone: "cyan",
            })),
          ]}
          action={{ label: "Nova turma", onClick: () => openForm("new-group") }}
        />
      )}
    </AsyncContent>
  );
}

export function PedagogyHubPage() {
  const students = useResource("students");
  const evaluations = useResource("evaluations");
  const { openForm } = useWorkspaceUi();
  return (
    <AsyncContent query={combineQueries(students, evaluations)}>
      {([studentList, evaluationList]) => (
        <ModulePage
          eyebrow="PEDAGÓGICO / EVOLUÇÃO"
          title="Acompanhamento pedagógico"
          description="Conteúdos, repertório, avaliações e metas por aluno."
          icon={CheckCircle2}
          heading={`${evaluationList.length} avaliações registradas`}
          items={[
            ...[...evaluationList]
              .sort((a, b) => String(b.date).localeCompare(String(a.date)))
              .slice(0, 3)
              .map((e) => ({
                id: `eval-${e.id}`,
                title: e.title,
                text: e.note,
                meta: `Nota ${e.score} · ${formatDate(e.date)}`,
                badge: "Avaliação",
              })),
            ...studentList.slice(0, 3).map((s) => ({
              id: `student-${s.id}`,
              title: s.name,
              text: s.repertoire ? `Repertório: ${s.repertoire.title}` : "Sem repertório definido.",
              meta: `${s.progress}% de progresso`,
              badge: "Plano",
              tone: "yellow",
            })),
          ]}
          action={{ label: "Nova avaliação", onClick: () => openForm("new-evaluation") }}
        />
      )}
    </AsyncContent>
  );
}

export function FinanceHubPage() {
  const plans = useResource("plans");
  const payouts = useAsync(getPayouts, []);
  const { openForm } = useWorkspaceUi();
  return (
    <AsyncContent query={combineQueries(plans, payouts)}>
      {([planList, payout]) => (
        <ModulePage
          eyebrow="FINANCEIRO / GESTÃO"
          title="Planos e repasses"
          description="Planos, descontos, cobrança automática, baixa manual e repasse docente."
          icon={WalletCards}
          heading={`Repasse do mês: ${formatCurrency(payout.total)}`}
          items={[
            ...planList.map((p) => ({
              id: `plan-${p.id}`,
              title: p.name,
              text: p.description,
              meta: p.discount ? `${p.discount}% de desconto` : `${formatCurrency(p.price)}/mês`,
              badge: "Plano",
            })),
            ...payout.items.map((item) => ({
              id: `payout-${item.teacher}`,
              title: `Repasse · ${item.teacher}`,
              text: `${item.students} aluno(s) pagantes · comissão de ${Math.round(item.commissionRate * 100)}%`,
              meta: formatCurrency(item.payout),
              badge: "Repasse",
              tone: "cyan",
            })),
          ]}
          action={{ label: "Nova cobrança", onClick: () => openForm("new-payment") }}
        />
      )}
    </AsyncContent>
  );
}

export function CommunicationPage() {
  const notifications = useResource("notifications");
  const events = useResource("events");
  const { openForm } = useWorkspaceUi();
  return (
    <AsyncContent query={combineQueries(notifications, events)}>
      {([notificationList, eventList]) => (
        <ModulePage
          eyebrow="COMUNICAÇÃO / EVENTOS"
          title="Comunicação e recitais"
          description="Envie comunicados e organize eventos, apresentações e recitais."
          icon={Megaphone}
          heading={`${notificationList.length} comunicados · ${eventList.length} eventos`}
          items={[
            ...notificationList.map((n) => ({
              id: `n-${n.id}`,
              title: n.title,
              text: n.text,
              meta: formatDate(n.createdAt),
              badge: "Comunicado",
            })),
            ...[...eventList]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((e) => ({
                id: `e-${e.id}`,
                title: e.title,
                text: e.description,
                meta: `${formatDate(e.date)} · ${e.location}`,
                badge: "Evento",
                tone: "cyan",
              })),
          ]}
          action={{ label: "Novo comunicado", onClick: () => openForm("new-notification") }}
        />
      )}
    </AsyncContent>
  );
}

export function AdministrationPage() {
  const audit = useResource("audit");
  const exportBackup = useBackupExport();
  return (
    <AsyncContent query={audit}>
      {(entries) => (
        <ModulePage
          eyebrow="ADMINISTRAÇÃO / LGPD"
          title="Administração e auditoria"
          description="Backup, trilhas de auditoria, permissões e privacidade."
          icon={ShieldCheck}
          kicker="TRILHA DE AUDITORIA"
          heading={`${entries.length} eventos registrados`}
          items={[...entries]
            .reverse()
            .slice(0, 9)
            .map((e) => ({
              id: e.id,
              title: e.summary,
              text: `${e.actor} · ${e.role}`,
              meta: new Date(e.at).toLocaleString("pt-BR"),
              badge: e.action,
              tone: "neutral",
            }))}
          action={{ label: "Exportar backup", onClick: exportBackup }}
        />
      )}
    </AsyncContent>
  );
}
