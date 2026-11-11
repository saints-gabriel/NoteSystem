import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import * as records from "../repositories/recordRepository.js";
import { ensureUser } from "../repositories/userRepository.js";
import { adminUser, baseRecordSeeds, buildDemoRecordSeeds, demoUsers } from "./seeds/index.js";

const PASSWORD_ROUNDS = 12;
const KINDS_LINKED_TO_STUDENT = new Set(["transactions", "evaluations"]);

export async function seedUsers() {
  const users = env.SEED_DEMO_DATA ? [adminUser, ...demoUsers] : [adminUser];
  for (const { password, ...user } of users) {
    const passwordHash = await bcrypt.hash(password, PASSWORD_ROUNDS);
    const { created } = await ensureUser({ ...user, passwordHash });
    if (created) console.log(`Usuário ${user.role} criado: ${user.email}`);
  }
}

/** Cobranças e avaliações guardam o id do aluno, resolvido pelo nome no momento do seed. */
async function linkToStudents(rows) {
  const students = await records.findAll("students");
  const idByName = new Map(students.map((student) => [student.name, student.id]));
  return rows.map((row) => ({ ...row, studentId: row.studentId ?? idByName.get(row.student) ?? null }));
}

/**
 * Insere os registros iniciais. Sem `force`, só preenche coleções vazias,
 * o que também popula recursos novos em bancos já existentes.
 */
export async function seedRecords({ force = false } = {}) {
  const seeds = env.SEED_DEMO_DATA ? [...buildDemoRecordSeeds(), ...baseRecordSeeds] : baseRecordSeeds;
  for (const [kind, rows] of seeds) {
    if (!rows.length || (!force && (await records.count(kind)))) continue;
    const prepared = KINDS_LINKED_TO_STUDENT.has(kind) ? await linkToStudents(rows) : rows;
    await records.insertMany(kind, prepared);
  }
}

export async function resetRecords() {
  await records.removeAll();
  await seedRecords({ force: true });
}
