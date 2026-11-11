export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (message, details) => new HttpError(400, message, details);
export const unauthorized = (message = "Token de acesso não informado.") => new HttpError(401, message);
export const forbidden = (message = "Você não possui permissão para este recurso.") =>
  new HttpError(403, message);
export const notFound = (message = "Recurso não encontrado.") => new HttpError(404, message);
