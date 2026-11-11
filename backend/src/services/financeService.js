import * as records from "../repositories/recordRepository.js";
import { addMonths, lastMonthKeys, monthKeyOf } from "../utils/dates.js";
import { percent, sum } from "../utils/numbers.js";
import { getSettings } from "./settingsService.js";

const isPaid = (transaction) => transaction.status === "Pago";
const inMonth = (transactions, month) => transactions.filter((item) => monthKeyOf(item.due) === month);

/** Receita (cobranças pagas) por mês, do mais antigo ao mais recente. */
export function revenueSeries(transactions, months = 12, endMonth = monthKeyOf(new Date())) {
  return lastMonthKeys(months, endMonth).map((month) => ({
    month,
    amount: sum(inMonth(transactions, month).filter(isPaid), (item) => item.amount),
  }));
}

export function summarizeMonth(transactions, month, goal = 0) {
  const items = inMonth(transactions, month);
  const byStatus = (status) => items.filter((item) => item.status === status);
  const paid = byStatus("Pago");
  const pending = byStatus("Pendente");
  const overdue = byStatus("Atrasado");
  const received = sum(paid, (item) => item.amount);
  const billed = sum(items, (item) => item.amount);

  const methods = [...new Set(paid.map((item) => item.method))];
  const methodSplit = methods
    .map((method) => ({
      method,
      percent: percent(
        sum(
          paid.filter((item) => item.method === method),
          (item) => item.amount,
        ),
        received,
      ),
    }))
    .sort((a, b) => b.percent - a.percent);

  return {
    month,
    received,
    billed,
    pendingAmount: sum(pending, (item) => item.amount),
    pendingCount: pending.length,
    overdueAmount: sum(overdue, (item) => item.amount),
    overdueCount: overdue.length,
    collectionRate: percent(received, billed),
    goal,
    goalProgress: percent(received, goal),
    methodSplit,
  };
}

const availableMonths = (transactions, current) =>
  [...new Set([current, ...transactions.map((item) => monthKeyOf(item.due))])].sort().reverse();

export async function getSummary(requestedMonth, now = new Date()) {
  const [transactions, settings] = await Promise.all([records.findAll("transactions"), getSettings()]);
  const currentMonth = monthKeyOf(now);
  const month = requestedMonth ?? currentMonth;
  const summary = summarizeMonth(transactions, month, settings.revenueGoal);
  const previous = sum(inMonth(transactions, addMonths(month, -1)).filter(isPaid), (item) => item.amount);
  return {
    ...summary,
    previousReceived: previous,
    months: availableMonths(transactions, currentMonth),
    series: revenueSeries(transactions, 12, month),
  };
}

export async function getPayouts(requestedMonth, now = new Date()) {
  const month = requestedMonth ?? monthKeyOf(now);
  const [transactions, students, teachers] = await Promise.all([
    records.findAll("transactions"),
    records.findAll("students"),
    records.findAll("teachers"),
  ]);
  const paid = inMonth(transactions, month).filter(isPaid);
  const teacherOf = new Map(students.map((student) => [student.name, student.teacher]));

  const items = teachers.map((teacher) => {
    const base = paid.filter((item) => teacherOf.get(item.student) === teacher.name);
    const baseAmount = sum(base, (item) => item.amount);
    return {
      teacher: teacher.name,
      commissionRate: teacher.commissionRate,
      students: new Set(base.map((item) => item.student)).size,
      baseAmount,
      payout: Math.round(baseAmount * teacher.commissionRate * 100) / 100,
    };
  });
  return { month, items, total: sum(items, (item) => item.payout) };
}
