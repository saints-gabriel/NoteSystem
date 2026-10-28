import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  JWT_SECRET: z.string().min(16).default("notesystem-development-secret"),
  DATABASE_URL: z.string().default("./data/notesystem.sqlite"),
  ADMIN_EMAIL: z.string().email().default("admin@notesystem.local"),
  ADMIN_PASSWORD: z.string().min(6).default("admin123"),
});

export const env = schema.parse(process.env);
