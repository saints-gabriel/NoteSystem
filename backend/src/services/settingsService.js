import * as records from "../repositories/recordRepository.js";
import { settings as defaultSettings } from "../database/seeds/settings.js";
import { recordAudit } from "./recordService.js";

const KIND = "settings";

export async function getSettings() {
  return (await records.findFirst(KIND)) ?? { ...defaultSettings };
}

export async function updateSettings(changes, actor) {
  const current = await records.findFirst(KIND);
  const saved = current
    ? await records.patch(KIND, current.id, changes)
    : await records.insert(KIND, { ...defaultSettings, ...changes });
  await recordAudit(actor, "update", "Atualizou as configurações da escola", KIND);
  return saved;
}
