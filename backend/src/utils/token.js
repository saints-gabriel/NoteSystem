import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const TOKEN_TTL = "8h";

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role, name: user.name, email: user.email }, env.JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });

export const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);
