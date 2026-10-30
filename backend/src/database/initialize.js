import { sequelize } from "../config/database.js";
import "../models/index.js";
import { seedRecords, seedUsers } from "./seeders.js";

export async function initializeDatabase() {
  await sequelize.sync();
  await seedUsers();
  await seedRecords();
}
