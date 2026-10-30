import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { ROLES } from "../constants/roles.js";

export const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM(...Object.values(ROLES)),
    allowNull: false,
    defaultValue: ROLES.STUDENT,
  },
});
