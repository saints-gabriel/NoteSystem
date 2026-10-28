import { Record } from "./index.js";

export async function findAllRecords(kind) {
  const records = await Record.findAll({ where: { kind }, order: [["id", "ASC"]] });
  return records.map((record) => ({ ...record.payload, id: record.id }));
}

export async function insertRecord(kind, payload) {
  const record = await Record.create({ kind, payload });
  return { ...record.payload, id: record.id };
}

export async function patchRecord(id, payload) {
  const record = await Record.findByPk(id);
  if (!record) return null;
  record.payload = { ...record.payload, ...payload };
  await record.save();
  return { ...record.payload, id: record.id };
}
