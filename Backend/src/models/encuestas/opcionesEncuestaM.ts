import { DataTypes } from "sequelize";
import db from "../../db/connection";

export const OpcionEncuesta = db.define(
  "OpcionEncuesta",
  {
    id_opcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_encuesta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "encuestas",
        key: "id_encuesta",
      },
      onDelete: "CASCADE",
    },
    texto_opcion: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "opciones_encuesta",
    timestamps: false,
  }
);
