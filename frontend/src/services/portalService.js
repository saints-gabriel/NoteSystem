import { get } from "./httpClient.js";

export const getPortal = () => get("/api/portal");
