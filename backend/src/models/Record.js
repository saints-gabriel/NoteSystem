import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

/**
 * Armazenamento genérico (kind + payload JSON). Todo acesso passa por
 * `repositories/recordRepository.js`, o que permite migrar um recurso para
 * uma tabela própria sem tocar em services ou controllers.
 */
export const Record = sequelize.define(
  "Record",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    kind: { type: DataTypes.STRING, allowNull: false },
    payload: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
  },
  { indexes: [{ fields: ["kind"] }] },
);
