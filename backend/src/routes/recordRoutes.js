import { Router } from "express";
import { allowRoles, requireAuth } from "../auth.js";
import { create, list, resources, update } from "../controllers/recordController.js";
const router = Router();
router.use(requireAuth);
router.get("/:kind", (req, res, next) => resources.includes(req.params.kind) ? list(req, res, next) : res.status(404).json({ error: "Recurso não encontrado." }));
router.post("/:kind", allowRoles("admin", "teacher"), (req, res, next) => resources.includes(req.params.kind) ? create(req, res, next) : res.status(404).json({ error: "Recurso não encontrado." }));
router.patch("/:kind/:id", allowRoles("admin", "teacher"), (req, res, next) => resources.includes(req.params.kind) ? update(req, res, next) : res.status(404).json({ error: "Recurso não encontrado." }));
export default router;
