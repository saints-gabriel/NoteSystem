import * as financeService from "../services/financeService.js";

const monthOf = (req) => (/^\d{4}-\d{2}$/.test(req.query.month ?? "") ? req.query.month : undefined);

export const summary = async (req, res) => res.json(await financeService.getSummary(monthOf(req)));

export const payouts = async (req, res) => res.json(await financeService.getPayouts(monthOf(req)));
