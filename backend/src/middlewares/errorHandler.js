import { z } from "zod";
import { HttpError } from "../utils/httpError.js";

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: "Rota não encontrada." });
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: "Dados inválidos.", details: z.flattenError(error) });
  }
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message, details: error.details });
  }
  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido." });
  }
  console.error(error);
  return res.status(500).json({ error: "Erro interno do servidor." });
}
