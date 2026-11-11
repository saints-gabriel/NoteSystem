import { isResource, RESOURCES } from "../constants/resources.js";
import { resourceSchemas } from "../validators/resourceSchemas.js";
import { forbidden, notFound } from "../utils/httpError.js";

/** Resolve `:resource` no registro central e rejeita nomes desconhecidos. */
export function resolveResource(req, _res, next) {
  const { resource } = req.params;
  if (!isResource(resource)) throw notFound();
  req.resource = { name: resource, ...RESOURCES[resource] };
  next();
}

/** `action`: "read" | "create" | "update". */
export const authorizeResource = (action) => (req, _res, next) => {
  if (!req.resource[action].includes(req.user.role)) throw forbidden();
  next();
};

export const validateResourceBody = (action) => (req, _res, next) => {
  req.body = resourceSchemas[req.resource.name][action].parse(req.body);
  next();
};
