import fs from "node:fs";
import path from "node:path";
import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import { initialClasses, initialEvaluations, initialGroups, initialNotifications, initialStudents, initialTransactions } from "../seed.js";

const storage = path.resolve(process.cwd(), env.DATABASE_URL);
fs.mkdirSync(path.dirname(storage), { recursive: true });
export const sequelize = new Sequelize({ dialect: "sqlite", storage, logging: false });

export const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("admin", "teacher", "student"), allowNull: false, defaultValue: "student" },
});
export const Record = sequelize.define("Record", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  kind: { type: DataTypes.STRING, allowNull: false },
  payload: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
});

const seeds = { students: initialStudents, classes: initialClasses, groups: initialGroups, transactions: initialTransactions, evaluations: initialEvaluations, notifications: initialNotifications };
export async function initializeDatabase() {
  await sequelize.sync();
  const demoUsers = [
    { name: "Gabriel Martins", email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD, role: "admin" },
    { name: "Ana Ribeiro", email: "professor@notesystem.local", password: "professor123", role: "teacher" },
    { name: "Helena Martins", email: "aluno@notesystem.local", password: "aluno123", role: "student" },
  ];
  for (const demoUser of demoUsers) {
    const [user] = await User.findOrCreate({
      where: { email: demoUser.email },
      defaults: { name: demoUser.name, passwordHash: await bcrypt.hash(demoUser.password, 12), role: demoUser.role },
    });
    if (user) console.log(`Usuário ${demoUser.role}: ${demoUser.email}`);
  }
  for (const [kind, rows] of Object.entries(seeds)) {
    if (!(await Record.count({ where: { kind } }))) await Record.bulkCreate(rows.map((payload) => ({ kind, payload })));
  }
}
