import { Router } from "express";
import { portal } from "../controllers/portalController.js";
import { requireAuth } from "../middlewares/authenticate.js";

const router = Router();

router.get("/", requireAuth, portal);

export default router;
