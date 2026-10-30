import { Router } from "express";
import { currentUser, login } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validate.js";
import { loginSchema } from "../validators/authSchemas.js";

const router = Router();

router.post("/login", validateBody(loginSchema), login);
router.get("/me", requireAuth, currentUser);

export default router;
