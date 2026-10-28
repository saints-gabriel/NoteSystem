import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import { env } from "./config/env.js";
import { User } from "./models/userModel.js";

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function authenticate(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;
  return jwt.sign({ sub: user.id, role: user.role, name: user.name, email: user.email }, env.JWT_SECRET, { expiresIn: "8h" });
}

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Token de acesso não informado." });
  try {
    req.user = jwt.verify(token, env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Token de acesso inválido ou expirado." });
  }
}

export const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Você não possui permissão para este recurso." });
  return next();
};
