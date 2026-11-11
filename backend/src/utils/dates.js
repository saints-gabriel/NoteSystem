const pad = (value) => String(value).padStart(2, "0");

/** Data local (fuso da escola) no formato AAAA-MM-DD. */
export function toIsoDate(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Chave de mês (AAAA-MM) de uma data ISO ou de um objeto Date. */
export function monthKeyOf(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}/.test(value)) return value.slice(0, 7);
  const date = new Date(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function addMonths(monthKey, amount) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1 + amount, 1);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

/** Os `count` meses terminando em `endMonth`, do mais antigo para o mais recente. */
export function lastMonthKeys(count, endMonth = monthKeyOf(new Date())) {
  return Array.from({ length: count }, (_, index) => addMonths(endMonth, index - (count - 1)));
}

/** Índice do dia da semana usado pela agenda: 0 = segunda ... 6 = domingo. */
export function weekdayIndex(date = new Date()) {
  return (date.getDay() + 6) % 7;
}
