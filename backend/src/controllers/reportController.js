import * as reportService from "../services/reportService.js";

export const report = async (req, res) =>
  res.json(await reportService.getReport(req.params.type, req.query.period));

export const enrollmentMix = async (_req, res) => res.json(await reportService.getEnrollmentMix());
