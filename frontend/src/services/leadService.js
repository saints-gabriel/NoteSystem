import { post } from "./httpClient.js";

export const createLead = (lead) => post("/api/public/leads", lead);
