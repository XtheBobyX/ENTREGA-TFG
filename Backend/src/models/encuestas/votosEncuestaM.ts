import { DataTypes } from "sequelize";
import db from "../../db/connection";

export const VotosEncuesta = db.define(
  "votos_encuesta",
  {
    id_voto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_encuesta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_opcion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "opciones_encuesta",
        key: "id_opcion",
      },
      onDelete: "CASCADE",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id_usuario",
      }
    },
  },
  {
    tableName: "votos_encuesta",
    timestamps: false,
  }
);
