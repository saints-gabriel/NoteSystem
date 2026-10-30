import { Router } from "express";
import { createLead } from "../controllers/leadController.js";
import { validateBody } from "../middlewares/validate.js";
import { leadSchema } from "../validators/leadSchemas.js";

const router = Router();

router.post("/leads", validateBody(leadSchema), createLead);

export default router;
