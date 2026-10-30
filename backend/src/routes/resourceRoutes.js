import { Router } from "express";
import { create, list, update } from "../controllers/recordController.js";
import { requireAuth } from "../middlewares/authenticate.js";
import { authorizeResource, resolveResource, validateResourceBody } from "../middlewares/resource.js";

const router = Router();

router.use("/:resource", requireAuth, resolveResource);
router.get("/:resource", authorizeResource("read"), list);
router.post("/:resource", authorizeResource("create"), validateResourceBody("create"), create);
router.patch("/:resource/:id", authorizeResource("update"), validateResourceBody("update"), update);

export default router;
