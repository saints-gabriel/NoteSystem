import * as settingsService from "../services/settingsService.js";

export const show = async (_req, res) => res.json(await settingsService.getSettings());

export const update = async (req, res) => res.json(await settingsService.updateSettings(req.body, req.user));
