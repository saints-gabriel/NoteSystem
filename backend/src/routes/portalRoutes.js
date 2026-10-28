import { Router } from "express";
import { requireAuth } from "../auth.js";
import { portal } from "../controllers/portalController.js";
const router = Router();
router.get("/", requireAuth, portal);
export default router;
