import fs from "node:fs";
import path from "node:path";
import { Sequelize } from "sequelize";
import { env } from "./env.js";

const storage = path.resolve(process.cwd(), env.DATABASE_URL);
fs.mkdirSync(path.dirname(storage), { recursive: true });

export const sequelize = new Sequelize({ dialect: "sqlite", storage, logging: false });
