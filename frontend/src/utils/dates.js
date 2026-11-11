const pad = (value) => String(value).padStart(2, "0");

export const toIsoDate = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const currentMonthKey = (date = new Date()) => toIsoDate(date).slice(0, 7);

/** Segunda = 0 ... domingo = 6 (mesma convenção da agenda na API). */
export const weekdayIndex = (date = new Date()) => (date.getDay() + 6) % 7;

export const WEEKDAY_LABELS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

/** Dias úteis (segunda a sábado) da semana deslocada em `weekOffset` semanas. */
export function weekDays(weekOffset = 0, reference = new Date()) {
  const monday = new Date(reference);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - weekdayIndex(monday) + weekOffset * 7);
  return WEEKDAY_LABELS.map((short, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return { index, short, day: date.getDate(), month: date.getMonth(), date };
  });
}

/** Mês seguinte ao atual, dia 5: sugestão de vencimento para novas cobranças. */
export function defaultDueDate(reference = new Date()) {
  const next = new Date(reference.getFullYear(), reference.getMonth() + 1, 5);
  return toIsoDate(next);
}
