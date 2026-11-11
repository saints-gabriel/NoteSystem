/** Valida (e normaliza) `req.body`. Erros de validação são tratados pelo errorHandler. */
export const validateBody = (schema) => (req, _res, next) => {
  req.body = schema.parse(req.body);
  next();
};
