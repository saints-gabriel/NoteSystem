import { Router } from "express";
import { summary } from "../controllers/dashboardController.js";
import { STAFF_ROLES } from "../constants/roles.js";
import { requireAuth } from "../middlewares/authenticate.js";
import { allowRoles } from "../middlewares/authorize.js";

const router = Router();

router.get("/", requireAuth, allowRoles(...STAFF_ROLES), summary);

export default router;
