import { RESOURCE_LABELS, RESOURCES } from "../constants/resources.js";
import * as records from "../repositories/recordRepository.js";
import { notFound } from "../utils/httpError.js";
import { withNextClass } from "./scheduleService.js";

/** Campos derivados anexados às respostas de cada recurso. */
const decorators = {
  students: async (items) => withNextClass(items, await records.findAll("classes")),
};

const decorate = async (resource, items) => (decorators[resource] ? decorators[resource](items) : items);

const describe = (resource, entity) =>
  `${RESOURCE_LABELS[resource]} ${entity.name ?? entity.title ?? entity.student ?? `#${entity.id}`}`;

export async function recordAudit(actor, action, summary, resource = null) {
  await records.insert("audit", {
    actor: actor.name,
    role: actor.role,
    action,
    resource,
    summary,
    at: new Date().toISOString(),
  });
}

async function auditWrite(resource, action, entity, actor) {
  if (!RESOURCES[resource].audited) return;
  const verb = action === "create" ? "Criou" : "Atualizou";
  await recordAudit(actor, action, `${verb} ${describe(resource, entity)}`, resource);
}

export async function list(resource) {
  return decorate(resource, await records.findAll(resource));
}

export async function create(resource, payload, actor) {
  const entity = await records.insert(resource, payload);
  await auditWrite(resource, "create", entity, actor);
  const [decorated] = await decorate(resource, [entity]);
  return decorated;
}

export async function update(resource, id, changes, actor) {
  const entity = await records.patch(resource, id, changes);
  if (!entity) throw notFound("Registro não encontrado.");
  await auditWrite(resource, "update", entity, actor);
  const [decorated] = await decorate(resource, [entity]);
  return decorated;
}
