import * as leadService from "../services/leadService.js";

export const createLead = async (req, res) => res.status(201).json(await leadService.createLead(req.body));
