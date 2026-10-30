import * as records from "../repositories/recordRepository.js";

export const createLead = (data) =>
  records.insert("leads", { ...data, status: "new", createdAt: new Date().toISOString() });
