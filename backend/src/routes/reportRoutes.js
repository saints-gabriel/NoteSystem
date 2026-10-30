import { Router } from "express";
import { enrollmentMix, report } from "../controllers/reportController.js";
import { STAFF_ROLES } from "../constants/roles.js";
import { requireAuth } from "../middlewares/authenticate.js";
import { allowRoles } from "../middlewares/authorize.js";

const router = Router();

router.use(requireAuth, allowRoles(...STAFF_ROLES));
router.get("/enrollment-mix", enrollmentMix);
router.get("/:type", report);

export default router;
