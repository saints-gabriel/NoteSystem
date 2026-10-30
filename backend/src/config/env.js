import "dotenv/config";
import { z } from "zod";

const DEFAULT_JWT_SECRET = "notesystem-development-secret";

const booleanFlag = z
  .enum(["true", "false"])
  .default("true")
  .transform((value) => value === "true");

const schema = z
  .object({
    NODE_ENV: z.string().default("development"),
    PORT: z.coerce.number().int().positive().default(3001),
    CLIENT_URL: z.string().default("http://localhost:3000"),
    JWT_SECRET: z.string().min(16).default(DEFAULT_JWT_SECRET),
    DATABASE_URL: z.string().default("./data/notesystem.sqlite"),
    ADMIN_EMAIL: z.email().default("admin@notesystem.local"),
    ADMIN_PASSWORD: z.string().min(6).default("admin123"),
    TIMEZONE: z.string().default("America/Sao_Paulo"),
    SEED_DEMO_DATA: booleanFlag,
  })
  .refine((config) => config.NODE_ENV !== "production" || config.JWT_SECRET !== DEFAULT_JWT_SECRET, {
    message: "Defina um JWT_SECRET próprio em produção.",
    path: ["JWT_SECRET"],
  });

export const env = schema.parse(process.env);

// Datas de cobrança e agenda são calculadas no fuso da escola, não no do servidor.
process.env.TZ = env.TIMEZONE;
