import { get } from "./httpClient.js";

const withMonth = (path, month) => (month ? `${path}?month=${month}` : path);

export const getFinanceSummary = (month) => get(withMonth("/api/finance/summary", month));
export const getPayouts = (month) => get(withMonth("/api/finance/payouts", month));
