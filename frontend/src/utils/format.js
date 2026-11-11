const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const number = new Intl.NumberFormat("pt-BR");
const MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const WEEKDAYS = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];

export const formatCurrency = (value) => currency.format(Number(value) || 0);
export const formatNumber = (value) => number.format(Number(value) || 0);
export const formatPercent = (value) => `${formatNumber(value)}%`;

/** Variação como "+8,4%" / "-2,1%". */
export const formatDelta = (value) =>
  `${value > 0 ? "+" : ""}${Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

const parseIso = (iso) => {
  const [year, month, day] = String(iso).slice(0, 10).split("-").map(Number);
  return { year, month, day };
};

/** "2026-10-24" → "24 out 2026" */
export function formatDate(iso) {
  if (!iso) return "—";
  const { year, month, day } = parseIso(iso);
  return `${String(day).padStart(2, "0")} ${MONTHS_SHORT[month - 1]} ${year}`;
}

/** "2026-10" → "OUT" */
export const formatMonthShort = (monthKey) => MONTHS_SHORT[Number(monthKey.slice(5, 7)) - 1].toUpperCase();

/** "2026-10" → "outubro de 2026" */
export function formatMonthLong(monthKey) {
  const { year, month } = parseIso(`${monthKey}-01`);
  return new Date(year, month - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

/** "2026-10-29" → "QUINTA / 29 OUT" */
export function formatWeekdayHeading(iso) {
  const { year, month, day } = parseIso(iso);
  const weekday = (new Date(year, month - 1, day).getDay() + 6) % 7;
  return `${WEEKDAYS[weekday].toUpperCase()} / ${String(day).padStart(2, "0")} ${MONTHS_SHORT[month - 1].toUpperCase()}`;
}

/** Tempo decorrido em texto curto: "12 min", "2 h", "3 d". */
export function formatTimeAgo(isoDateTime, now = Date.now()) {
  const minutes = Math.max(1, Math.round((now - new Date(isoDateTime).getTime()) / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours} h` : `${Math.round(hours / 24)} d`;
}

export function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  return hour < 18 ? "Boa tarde" : "Boa noite";
}

export const firstName = (name = "") => name.trim().split(" ")[0] ?? "";

export const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
