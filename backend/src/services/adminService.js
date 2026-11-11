import { env } from "../config/env.js";
import { ALL_KINDS } from "../constants/resources.js";
import { resetRecords } from "../database/seeders.js";
import * as records from "../repositories/recordRepository.js";
import { forbidden } from "../utils/httpError.js";
import { recordAudit } from "./recordService.js";

export async function exportBackup(actor) {
  const entries = await Promise.all(ALL_KINDS.map(async (kind) => [kind, await records.findAll(kind)]));
  await recordAudit(actor, "export", "Exportou backup completo dos dados", "backup");
  return { exportedAt: new Date().toISOString(), data: Object.fromEntries(entries) };
}

export async function resetDemoData(actor) {
  if (!env.SEED_DEMO_DATA) throw forbidden("Restauração indisponível: dados de demonstração desativados.");
  await resetRecords();
  await recordAudit(actor, "reset", "Restaurou os dados de demonstração", "backup");
}
