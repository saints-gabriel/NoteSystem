import { get, post } from "./httpClient.js";
import { getStoredUser, setToken } from "./tokenStorage.js";

export async function login(credentials) {
  const { token } = await post("/api/auth/login", credentials);
  setToken(token);
  return getStoredUser();
}

export const fetchCurrentUser = async () => (await get("/api/auth/me")).user;
