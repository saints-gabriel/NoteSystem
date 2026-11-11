import { get, post } from "./httpClient.js";

export const getBackup = () => get("/api/admin/backup");
export const resetDemoData = () => post("/api/admin/reset-demo");
