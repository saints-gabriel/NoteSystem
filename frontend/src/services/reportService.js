import { get } from "./httpClient.js";

export const getReport = (type, period) => get(`/api/reports/${type}?period=${period}`);
export const getEnrollmentMix = () => get("/api/reports/enrollment-mix");
