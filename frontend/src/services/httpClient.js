import { API_URL } from "../config/env.js";
import { clearToken, getToken } from "./tokenStorage.js";

export class ApiError extends Error {
  constructor(message, { status = 0, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

let unauthorizedHandler = () => {};

/** Permite à sessão reagir a tokens expirados sem acoplar o cliente HTTP ao React. */
export const onUnauthorized = (handler) => {
  unauthorizedHandler = handler;
};

const messageFrom = (body) => {
  const fieldErrors = Object.values(body?.details?.fieldErrors ?? {}).flat();
  return fieldErrors[0] ?? body?.error ?? "Não foi possível concluir a operação.";
};

export async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Não foi possível conectar à API. Verifique se o servidor está em execução.");
  }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearToken();
      unauthorizedHandler();
    }
    throw new ApiError(messageFrom(data), { status: response.status, details: data.details });
  }
  return data;
}

export const get = (path) => request(path);
export const post = (path, body) => request(path, { method: "POST", body });
export const patch = (path, body) => request(path, { method: "PATCH", body });
export const put = (path, body) => request(path, { method: "PUT", body });
