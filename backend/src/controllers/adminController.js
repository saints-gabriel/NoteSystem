import * as adminService from "../services/adminService.js";

export const backup = async (req, res) => res.json(await adminService.exportBackup(req.user));

export const resetDemo = async (req, res) => {
  await adminService.resetDemoData(req.user);
  res.status(204).end();
};
