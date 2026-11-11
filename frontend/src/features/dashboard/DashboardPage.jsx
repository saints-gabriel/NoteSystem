import { UserPlus } from "lucide-react";
import { AsyncContent, PageTitle } from "../../components/ui/index.js";
import { useSession } from "../../context/SessionContext.jsx";
import { useWorkspaceUi } from "../../context/WorkspaceUiContext.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { getDashboardSummary } from "../../services/dashboardService.js";
import { firstName, greetingFor } from "../../utils/format.js";
import { FeaturedStudents } from "./FeaturedStudents.jsx";
import { InsightsPanel } from "./InsightsPanel.jsx";
import { RevenuePanel } from "./RevenuePanel.jsx";
import { StatsGrid } from "./StatsGrid.jsx";
import { TodayPanel } from "./TodayPanel.jsx";

export function DashboardPage() {
  const { user } = useSession();
  const { openForm } = useWorkspaceUi();
  const query = useAsync(getDashboardSummary, []);

  return (
    <div className="view dashboard-view">
      <PageTitle
        eyebrow="SISTEMA OPERACIONAL / ONLINE"
        title={
          <>
            {greetingFor()}, {firstName(user?.name)}.
            <br />
            <span>A escola está em movimento.</span>
          </>
        }
        description="Acompanhe o ritmo da escola e antecipe o que precisa da sua atenção."
        actions={
          <button className="button button-primary" onClick={() => openForm("new-student")}>
            <UserPlus size={17} />
            Novo aluno
          </button>
        }
      />
      <AsyncContent query={query}>
        {(summary) => (
          <>
            <StatsGrid stats={summary.stats} />
            <div className="dashboard-grid">
              <RevenuePanel revenue={summary.revenue} />
              <InsightsPanel insights={summary.insights} />
              <TodayPanel today={summary.today} classes={summary.todayClasses} />
              <FeaturedStudents students={summary.featuredStudents} />
            </div>
          </>
        )}
      </AsyncContent>
    </div>
  );
}
