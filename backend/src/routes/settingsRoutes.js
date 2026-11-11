import { Router } from "express";
import { show, update } from "../controllers/settingsController.js";
import { ADMIN_ONLY, STAFF_ROLES } from "../constants/roles.js";
import { requireAuth } from "../middlewares/authenticate.js";
import { allowRoles } from "../middlewares/authorize.js";
import { validateBody } from "../middlewares/validate.js";
import { settingsSchema } from "../validators/settingsSchemas.js";

const router = Router();

router.use(requireAuth);
router.get("/", allowRoles(...STAFF_ROLES), show);
router.put("/", allowRoles(...ADMIN_ONLY), validateBody(settingsSchema), update);

export default router;
