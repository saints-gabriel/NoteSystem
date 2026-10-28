import express from "express";
import cors from "cors";
import helmet from "helmet";
import { z } from "zod";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import portalRoutes from "./routes/portalRoutes.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URL }));
  app.use(express.json({ limit: "1mb" }));
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/public", publicRoutes);
  app.use("/api/portal", portalRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api", recordRoutes);
  app.use((error, _req, res, _next) => {
    if (error instanceof z.ZodError) return res.status(400).json({ error: "Dados inválidos.", details: error.flatten() });
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  });
  return app;
}
