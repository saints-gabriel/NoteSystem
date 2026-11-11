import { classes } from "./classes.js";
import { courses, events, plans, rooms, teachers } from "./catalog.js";
import { evaluations } from "./evaluations.js";
import { groups } from "./groups.js";
import { notifications } from "./notifications.js";
import { settings } from "./settings.js";
import { students } from "./students.js";
import { transactions } from "./transactions.js";

export { adminUser, demoUsers } from "./users.js";

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

/**
 * Registros de demonstração na ordem em que devem ser inseridos.
 * `students` vem primeiro: `seeders.js` usa os ids gerados para ligar
 * cobranças e avaliações ao aluno correspondente. É uma função para que
 * os horários relativos (notificações) sejam calculados no momento do seed.
 */
export const buildDemoRecordSeeds = () => [
  ["students", students],
  ["teachers", teachers],
  ["courses", courses],
  ["rooms", rooms],
  ["classes", classes],
  ["groups", groups],
  ["transactions", transactions],
  ["evaluations", evaluations],
  [
    "notifications",
    notifications.map(({ minutesAgo: age, ...item }) => ({ ...item, createdAt: minutesAgo(age) })),
  ],
  ["plans", plans],
  ["events", events],
  ["audit", []],
];

/** Registros necessários em qualquer ambiente, inclusive produção. */
export const baseRecordSeeds = [["settings", [settings]]];
