import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import financeRoutes from "./financeRoutes.js";
import portalRoutes from "./portalRoutes.js";
import publicRoutes from "./publicRoutes.js";
import reportRoutes from "./reportRoutes.js";
import resourceRoutes from "./resourceRoutes.js";
import settingsRoutes from "./settingsRoutes.js";

const router = Router();

// Rotas específicas primeiro; `/:resource` (CRUD genérico) precisa ser a última.
router.use("/public", publicRoutes);
router.use("/auth", authRoutes);
router.use("/portal", portalRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/finance", financeRoutes);
router.use("/reports", reportRoutes);
router.use("/settings", settingsRoutes);
router.use("/admin", adminRoutes);
router.use(resourceRoutes);

export default router;
