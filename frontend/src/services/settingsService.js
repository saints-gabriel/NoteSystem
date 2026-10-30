import { get, put } from "./httpClient.js";

export const getSettings = () => get("/api/settings");
export const saveSettings = (settings) => put("/api/settings", settings);
