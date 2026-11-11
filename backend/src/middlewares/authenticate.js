import { unauthorized } from "../utils/httpError.js";
import { verifyToken } from "../utils/token.js";

export function requireAuth(req, _res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) throw unauthorized();
  try {
    req.user = verifyToken(token);
  } catch {
    throw unauthorized("Token de acesso inválido ou expirado.");
  }
  next();
}
