import { Router } from "express";
import { backup, resetDemo } from "../controllers/adminController.js";
import { ADMIN_ONLY } from "../constants/roles.js";
import { requireAuth } from "../middlewares/authenticate.js";
import { allowRoles } from "../middlewares/authorize.js";

const router = Router();

router.use(requireAuth, allowRoles(...ADMIN_ONLY));
router.get("/backup", backup);
router.post("/reset-demo", resetDemo);

export default router;
