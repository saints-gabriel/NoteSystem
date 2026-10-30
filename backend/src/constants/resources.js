import { ADMIN_ONLY, STAFF_ROLES } from "./roles.js";

/**
 * Registro central dos recursos expostos em `/api/:resource`.
 * Para criar um novo recurso: adicione-o aqui, crie o schema em
 * `validators/resourceSchemas.js` e (opcionalmente) um seed em `database/seeds`.
 *
 * - read/create/update: papéis autorizados (lista vazia = ação indisponível pela API)
 * - audited: grava uma linha na trilha de auditoria a cada escrita
 */
const staffResource = { read: STAFF_ROLES, create: STAFF_ROLES, update: STAFF_ROLES, audited: true };
const adminManagedResource = { read: STAFF_ROLES, create: ADMIN_ONLY, update: ADMIN_ONLY, audited: true };

export const RESOURCES = Object.freeze({
  students: staffResource,
  classes: staffResource,
  groups: staffResource,
  transactions: staffResource,
  evaluations: staffResource,
  notifications: staffResource,
  events: staffResource,
  leads: { read: STAFF_ROLES, create: [], update: STAFF_ROLES, audited: true },
  courses: adminManagedResource,
  rooms: adminManagedResource,
  teachers: adminManagedResource,
  plans: adminManagedResource,
  audit: { read: ADMIN_ONLY, create: [], update: [], audited: false },
});

/** Nome singular (pt-BR) usado em mensagens e na trilha de auditoria. */
export const RESOURCE_LABELS = Object.freeze({
  students: "aluno",
  classes: "aula",
  groups: "turma",
  transactions: "cobrança",
  evaluations: "avaliação",
  notifications: "comunicado",
  events: "evento",
  leads: "lead",
  courses: "curso",
  rooms: "sala",
  teachers: "professor",
  plans: "plano",
  audit: "registro de auditoria",
});

/** Coleções que existem no banco, mas não são expostas diretamente pela API genérica. */
export const INTERNAL_KINDS = Object.freeze(["settings"]);

export const ALL_KINDS = Object.freeze([...Object.keys(RESOURCES), ...INTERNAL_KINDS]);

export const isResource = (name) => Object.hasOwn(RESOURCES, name);
