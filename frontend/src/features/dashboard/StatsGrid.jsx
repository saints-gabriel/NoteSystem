import { AlertTriangle, CalendarDays, CircleDollarSign, Users } from "lucide-react";
import { StatCard } from "../../components/ui/index.js";
import { formatCurrency } from "../../utils/format.js";

const plural = (count, singular, pluralForm) => (count === 1 ? singular : pluralForm);

export function StatsGrid({ stats }) {
  return (
    <section className="stats-grid">
      <StatCard
        label="Alunos ativos"
        value={stats.activeStudents}
        icon={Users}
        detail={
          <>
            <b>+{stats.newStudentsThisMonth}</b>{" "}
            {plural(stats.newStudentsThisMonth, "nova matrícula", "novas matrículas")} neste mês
          </>
        }
      />
      <StatCard
        label="Receita no mês"
        value={formatCurrency(stats.monthRevenue)}
        icon={CircleDollarSign}
        tone="green"
        detail={
          <>
            Meta mensal: <b>{formatCurrency(stats.revenueGoal)}</b> ({stats.goalProgress}%)
          </>
        }
      />
      <StatCard
        label="Aulas nesta semana"
        value={stats.weeklyClasses}
        icon={CalendarDays}
        tone="cyan"
        detail={
          <>
            <b>{stats.todayClasses}</b> {plural(stats.todayClasses, "aula", "aulas")} hoje
          </>
        }
      />
      <StatCard
        label="Em inadimplência"
        value={formatCurrency(stats.overdueAmount)}
        icon={AlertTriangle}
        tone="red"
        detail={
          <>
            <b>
              {stats.overdueCount} {plural(stats.overdueCount, "cobrança", "cobranças")}
            </b>{" "}
            {plural(stats.overdueCount, "precisa", "precisam")} de atenção
          </>
        }
      />
    </section>
  );
}
