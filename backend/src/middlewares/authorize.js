import { forbidden } from "../utils/httpError.js";

export const allowRoles =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) throw forbidden();
    next();
  };
