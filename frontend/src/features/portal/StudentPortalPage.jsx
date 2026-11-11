import { LogOut } from "lucide-react";
import { AsyncContent, PageTitle } from "../../components/ui/index.js";
import { useSession } from "../../context/SessionContext.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { getPortal } from "../../services/portalService.js";
import { firstName, formatCurrency } from "../../utils/format.js";

const latestFirst = (items) => [...items].sort((a, b) => String(b.date).localeCompare(String(a.date)));

export function StudentPortalPage() {
  const { user, signOut } = useSession();
  const query = useAsync(getPortal, []);

  return (
    <main className="view">
      <PageTitle
        eyebrow="ÁREA DO ALUNO"
        title={`Olá, ${firstName(user?.name) || "estudante"}.`}
        description="Dados carregados pela API para a sua conta."
        actions={
          <button className="button button-secondary" onClick={signOut}>
            <LogOut size={16} />
            Sair
          </button>
        }
      />
      <AsyncContent query={query}>{(portal) => <PortalContent portal={portal} user={user} />}</AsyncContent>
    </main>
  );
}

function PortalContent({ portal, user }) {
  const { student, classes, transactions, evaluations } = portal;
  const lastEvaluation = latestFirst(evaluations)[0];
  const openCharges = transactions.filter((item) => item.status !== "Pago");

  return (
    <>
      <div className="stats-grid">
        <article className="stat-card border-glow-cyan">
          <strong className="stat-value">{student.nextClass ?? "Sem aula"}</strong>
          <span className="stat-label">Próxima aula</span>
          <div className="stat-detail">
            {classes[0]
              ? `${classes[0].course} · ${classes[0].room || "Sala a definir"}`
              : "Nenhuma aula agendada"}
          </div>
        </article>
        <article className="stat-card border-glow-green">
          <strong className="stat-value">{student.attendance ?? 0}%</strong>
          <span className="stat-label">Frequência</span>
          <div className="stat-detail">{student.course || "Matrícula ativa"}</div>
        </article>
        <article className="stat-card border-glow-yellow">
          <strong className="stat-value">{lastEvaluation?.score ?? "—"}</strong>
          <span className="stat-label">Última avaliação</span>
          <div className="stat-detail">{lastEvaluation?.title || "Ainda não avaliado"}</div>
        </article>
      </div>
      <section className="panel landing-card">
        <div>
          <span className="panel-kicker">MEU ACOMPANHAMENTO</span>
          <h2>{student.name || user?.name}</h2>
          <p>
            {student.email || user?.email} · {transactions.length} cobranças na conta
            {openCharges.length > 0 &&
              `, ${openCharges.length} em aberto (${formatCurrency(openCharges.reduce((sum, item) => sum + item.amount, 0))})`}
            .
          </p>
        </div>
      </section>
    </>
  );
}
