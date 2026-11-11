const TOKEN_KEY = "notesystem-token";

const safely = (action, fallback = null) => {
  try {
    return action();
  } catch {
    return fallback;
  }
};

export const getToken = () => safely(() => localStorage.getItem(TOKEN_KEY));
export const setToken = (token) => safely(() => localStorage.setItem(TOKEN_KEY, token));
export const clearToken = () => safely(() => localStorage.removeItem(TOKEN_KEY));

/** Usuário contido no payload do JWT (a assinatura é validada pela API em `/auth/me`). */
export function getStoredUser() {
  const token = getToken();
  if (!token) return null;
  const user = safely(() => JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))));
  if (!user) clearToken();
  return user;
}
