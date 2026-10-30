import { get } from "./httpClient.js";

export const getDashboardSummary = () => get("/api/dashboard");
