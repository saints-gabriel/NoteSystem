import * as records from "../repositories/recordRepository.js";
import { monthKeyOf, toIsoDate, weekdayIndex } from "../utils/dates.js";
import { average, percent, sum } from "../utils/numbers.js";
import { classesOnDay, withNextClass } from "./scheduleService.js";
import { getSettings } from "./settingsService.js";
import { revenueSeries, summarizeMonth } from "./financeService.js";
import { variation } from "../utils/numbers.js";

const AT_RISK_ATTENDANCE = 75;
const FEATURED_STUDENTS = 4;

export const studentsAtRisk = (students) =>
  students.filter((student) => student.status !== "Inativo" && student.attendance < AT_RISK_ATTENDANCE);

export const groupOccupancy = (group) => percent(group.students, group.capacity);

/** Observações calculadas a partir dos dados reais da escola. */
export function buildInsights({ students, groups, transactions }, month) {
  const insights = [];

  const fullest = [...groups].sort((a, b) => groupOccupancy(b) - groupOccupancy(a))[0];
  if (fullest) {
    const occupancy = groupOccupancy(fullest);
    insights.push({
      title: occupancy >= 85 ? "Ocupação em alta" : "Ocupação saudável",
      text:
        occupancy >= 85
          ? `${fullest.name} está com ${occupancy}% das vagas ocupadas. Considere abrir uma nova turma.`
          : `A turma mais cheia, ${fullest.name}, está com ${occupancy}% das vagas ocupadas.`,
    });
  }

  const atRisk = studentsAtRisk(students);
  insights.push({
    title: "Risco de evasão",
    text: atRisk.length
      ? `${atRisk.length} aluno(s) com frequência abaixo de ${AT_RISK_ATTENDANCE}%: ${atRisk.map((s) => s.name).join(", ")}.`
      : `Nenhum aluno ativo com frequência abaixo de ${AT_RISK_ATTENDANCE}%.`,
  });

  const { overdueCount, overdueAmount } = summarizeMonth(transactions, month);
  if (overdueCount) {
    insights.push({
      title: "Cobranças em atraso",
      text: `${overdueCount} cobrança(s) vencida(s) neste mês, somando R$ ${overdueAmount.toLocaleString("pt-BR")}.`,
    });
  }
  return insights;
}

export async function getSummary(now = new Date()) {
  const [students, classes, groups, transactions, settings] = await Promise.all([
    records.findAll("students"),
    records.findAll("classes"),
    records.findAll("groups"),
    records.findAll("transactions"),
    getSettings(),
  ]);

  const month = monthKeyOf(now);
  const finance = summarizeMonth(transactions, month, settings.revenueGoal);
  const series = revenueSeries(transactions, 12, month);
  const paidTransactions = transactions.filter((item) => item.status === "Pago");
  const lastFullMonths = series.slice(-3, -1);
  const todayIndex = weekdayIndex(now);

  return {
    today: { date: toIsoDate(now), weekday: todayIndex },
    stats: {
      activeStudents: students.filter((student) => student.status === "Ativo").length,
      newStudentsThisMonth: students.filter((student) => monthKeyOf(student.enrolledAt) === month).length,
      monthRevenue: finance.received,
      revenueGoal: finance.goal,
      goalProgress: finance.goalProgress,
      weeklyClasses: classes.length,
      todayClasses: classesOnDay(classes, todayIndex).length,
      overdueAmount: finance.overdueAmount,
      overdueCount: finance.overdueCount,
    },
    revenue: {
      series,
      total: sum(series, (item) => item.amount),
      averageTicket: Math.round(average(paidTransactions, (item) => item.amount) * 100) / 100,
      growthPct:
        lastFullMonths.length === 2 ? variation(lastFullMonths[1].amount, lastFullMonths[0].amount) : null,
    },
    insights: buildInsights({ students, groups, transactions }, month),
    todayClasses: classesOnDay(classes, todayIndex),
    featuredStudents: withNextClass(
      [...students].sort((a, b) => b.progress - a.progress).slice(0, FEATURED_STUDENTS),
      classes,
      now,
    ),
  };
}
