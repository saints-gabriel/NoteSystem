import { env } from "../../config/env.js";
import { ROLES } from "../../constants/roles.js";

export const adminUser = {
  name: "Gabriel Martins",
  email: env.ADMIN_EMAIL,
  password: env.ADMIN_PASSWORD,
  role: ROLES.ADMIN,
};

export const demoUsers = [
  { name: "Ana Ribeiro", email: "professor@notesystem.local", password: "professor123", role: ROLES.TEACHER },
  { name: "Helena Martins", email: "aluno@notesystem.local", password: "aluno123", role: ROLES.STUDENT },
];
