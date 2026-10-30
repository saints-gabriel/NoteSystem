import { Router } from "express";
import { payouts, summary } from "../controllers/financeController.js";
import { STAFF_ROLES } from "../constants/roles.js";
import { requireAuth } from "../middlewares/authenticate.js";
import { allowRoles } from "../middlewares/authorize.js";

const router = Router();

router.use(requireAuth, allowRoles(...STAFF_ROLES));
router.get("/summary", summary);
router.get("/payouts", payouts);

export default router;
