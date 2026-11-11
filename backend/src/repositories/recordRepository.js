import { Record } from "../models/index.js";

const toEntity = (record) => ({ ...record.payload, id: record.id });

export async function findAll(kind) {
  const records = await Record.findAll({ where: { kind }, order: [["id", "ASC"]] });
  return records.map(toEntity);
}

export async function findById(kind, id) {
  const record = await Record.findOne({ where: { kind, id } });
  return record ? toEntity(record) : null;
}

export async function findFirst(kind) {
  const record = await Record.findOne({ where: { kind }, order: [["id", "ASC"]] });
  return record ? toEntity(record) : null;
}

export const count = (kind) => Record.count({ where: { kind } });

export async function insert(kind, payload) {
  const record = await Record.create({ kind, payload });
  return toEntity(record);
}

export async function insertMany(kind, payloads) {
  const records = await Record.bulkCreate(payloads.map((payload) => ({ kind, payload })));
  return records.map(toEntity);
}

/** Atualiza apenas registros do `kind` informado (ids são globais na tabela). */
export async function patch(kind, id, changes) {
  const record = await Record.findOne({ where: { kind, id } });
  if (!record) return null;
  const { id: _ignored, ...safeChanges } = changes;
  record.payload = { ...record.payload, ...safeChanges };
  await record.save();
  return toEntity(record);
}

export const removeAll = () => Record.destroy({ where: {} });
