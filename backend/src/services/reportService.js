import * as records from "../repositories/recordRepository.js";
import { monthKeyOf } from "../utils/dates.js";
import { badRequest } from "../utils/httpError.js";
import { average, percent, sum, variation } from "../utils/numbers.js";
import { buildInsights, groupOccupancy, studentsAtRisk } from "./dashboardService.js";
import { revenueSeries, summarizeMonth } from "./financeService.js";

const PERIOD_MONTHS = { "30d": 1, "90d": 3, year: 12 };
export const REPORT_TYPES = ["executive", "financial", "attendance", "schedule"];

const round1 = (value) => Math.round(value * 10) / 10;

const kpi = (key, label, value, format, delta = null, detail = null) => ({
  key,
  label,
  value,
  format,
  delta,
  detail,
});

/** Cada relatório recebe os dados já carregados e devolve seus indicadores. */
const builders = {
  executive: ({ students, revenue, previousRevenue }) => {
    const active = students.filter((item) => item.status === "Ativo");
    return [
      kpi("activeStudents", "Alunos ativos", active.length, "number"),
      kpi("attendance", "Frequência média", Math.round(average(students, (s) => s.attendance)), "percent"),
      kpi("revenue", "Receita", revenue, "currency", variation(revenue, previousRevenue)),
      kpi(
        "retention",
        "Retenção",
        percent(students.filter((s) => s.status !== "Inativo").length, students.length),
        "percent",
      ),
    ];
  },
  financial: ({ transactions, month, revenue, previousRevenue, goal }) => {
    const current = summarizeMonth(transactions, month, goal);
    const paid = transactions.filter((item) => item.status === "Pago");
    return [
      kpi("revenue", "Receita", revenue, "currency", variation(revenue, previousRevenue)),
      kpi("ticket", "Ticket médio", Math.round(average(paid, (item) => item.amount)), "currency"),
      kpi("overdue", "Em inadimplência", current.overdueAmount, "currency"),
      kpi("collection", "Recebido no mês", current.collectionRate, "percent"),
    ];
  },
  attendance: ({ students }) => [
    kpi("attendance", "Frequência média", Math.round(average(students, (s) => s.attendance)), "percent"),
    kpi("atRisk", "Alunos em risco", studentsAtRisk(students).length, "number"),
    kpi("inactive", "Alunos inativos", students.filter((s) => s.status === "Inativo").length, "number"),
    kpi("progress", "Progresso médio", Math.round(average(students, (s) => s.progress)), "percent"),
  ],
  schedule: ({ classes, groups, rooms }) => [
    kpi("weeklyClasses", "Aulas por semana", classes.length, "number"),
    kpi(
      "rooms",
      "Salas em uso",
      new Set(classes.map((item) => item.room)).size,
      "number",
      null,
      `de ${rooms.length} salas`,
    ),
    kpi("fullGroups", "Turmas lotadas", groups.filter((g) => groupOccupancy(g) >= 100).length, "number"),
    kpi(
      "freeSeats",
      "Vagas livres",
      sum(groups, (g) => Math.max(0, g.capacity - g.students)),
      "number",
    ),
  ],
};

function conclusion({ type, students, groups, transactions, month }) {
  const insights = buildInsights({ students, groups, transactions }, month);
  return insights.map((item) => item.text).join(" ") || `Relatório ${type} sem observações no período.`;
}

export async function getReport(type, period = "30d", now = new Date()) {
  if (!REPORT_TYPES.includes(type)) throw badRequest("Tipo de relatório inválido.");
  if (!(period in PERIOD_MONTHS)) throw badRequest("Período inválido.");

  const [students, classes, groups, rooms, transactions, settings] = await Promise.all([
    records.findAll("students"),
    records.findAll("classes"),
    records.findAll("groups"),
    records.findAll("rooms"),
    records.findAll("transactions"),
    records.findFirst("settings"),
  ]);

  const month = monthKeyOf(now);
  const months = PERIOD_MONTHS[period];
  const window = revenueSeries(transactions, months * 2, month);
  const revenue = sum(window.slice(months), (item) => item.amount);
  const previousRevenue = sum(window.slice(0, months), (item) => item.amount);

  const context = {
    students,
    classes,
    groups,
    rooms,
    transactions,
    month,
    revenue,
    previousRevenue,
    goal: settings?.revenueGoal ?? 0,
  };
  return {
    type,
    period,
    kpis: builders[type](context),
    series: revenueSeries(transactions, 12, month),
    conclusion: conclusion({ type, students, groups, transactions, month }),
  };
}

/** Distribuição das matrículas por tipo de formação (usada em "Turmas & cursos"). */
export async function getEnrollmentMix() {
  const [students, groups, courses] = await Promise.all([
    records.findAll("students"),
    records.findAll("groups"),
    records.findAll("courses"),
  ]);
  const categoryOf = new Map(courses.map((course) => [course.name, course.category]));
  const active = students.filter((student) => student.status !== "Inativo");
  const count = (categories) =>
    active.filter((student) => categories.includes(categoryOf.get(student.course))).length;

  const buckets = [
    { key: "instrument", label: "Instrumentos individuais", value: count(["Instrumento"]) },
    { key: "collective", label: "Turmas coletivas", value: sum(groups, (group) => group.students) },
    { key: "voice", label: "Canto & musicalização", value: count(["Voz", "Musicalização"]) },
  ];
  const total = sum(buckets, (bucket) => bucket.value);
  return { total, items: buckets.map((bucket) => ({ ...bucket, percent: percent(bucket.value, total) })) };
}
