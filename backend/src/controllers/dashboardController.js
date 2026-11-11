import * as dashboardService from "../services/dashboardService.js";

export const summary = async (_req, res) => res.json(await dashboardService.getSummary());
