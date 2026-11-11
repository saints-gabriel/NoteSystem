export const sum = (items, pick = (item) => item) =>
  items.reduce((total, item) => total + Number(pick(item) || 0), 0);

export const average = (items, pick = (item) => item) => (items.length ? sum(items, pick) / items.length : 0);

export const percent = (part, total) => (total ? Math.round((part / total) * 100) : 0);

/** Variação percentual entre dois valores. Retorna `null` quando não há base de comparação. */
export const variation = (current, previous) =>
  previous ? Math.round(((current - previous) / previous) * 1000) / 10 : null;
