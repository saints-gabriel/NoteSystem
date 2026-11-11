import * as portalService from "../services/portalService.js";

export const portal = async (req, res) => res.json(await portalService.getPortal(req.user));
