const runtimeEnv = globalThis.process?.env;
const API_URL = runtimeEnv?.VITE_API_URL || runtimeEnv?.BUN_PUBLIC_API_URL || "http://localhost:3001";

export function getCurrentUser() {
  const token = localStorage.getItem("notesystem-token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    localStorage.removeItem("notesystem-token");
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("notesystem-token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Não foi possível concluir a operação.");
  return body;
}

export const api = {
  login: (credentials) => apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  dashboard: () => apiRequest("/api/dashboard"),
  list: (resource) => apiRequest(`/api/${resource}`),
  create: (resource, data) => apiRequest(`/api/${resource}`, { method: "POST", body: JSON.stringify(data) }),
  update: (resource, id, data) => apiRequest(`/api/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  createLead: (data) => apiRequest("/api/public/leads", { method: "POST", body: JSON.stringify(data) }),
  me: () => apiRequest("/api/auth/me"),
  portal: () => apiRequest("/api/portal"),
};
