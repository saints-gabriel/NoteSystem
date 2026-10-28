import { z } from "zod";
import { findAllRecords, insertRecord, patchRecord } from "../models/recordModel.js";

export const resources = ["students", "classes", "groups", "transactions", "evaluations", "notifications", "leads", "courses", "rooms", "events", "audit"];
const payloadSchema = z.record(z.string(), z.unknown());
export async function list(req, res, next) {
  try { return res.json(await findAllRecords(req.params.kind)); } catch (error) { return next(error); }
}
export async function create(req, res, next) {
  try { return res.status(201).json(await insertRecord(req.params.kind, payloadSchema.parse(req.body))); } catch (error) { return next(error); }
}
export async function update(req, res, next) {
  try {
    const item = await patchRecord(Number(req.params.id), payloadSchema.parse(req.body));
    return item ? res.json(item) : res.status(404).json({ error: "Registro não encontrado." });
  } catch (error) { return next(error); }
}
