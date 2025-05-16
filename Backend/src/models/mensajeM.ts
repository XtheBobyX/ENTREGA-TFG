import { DataTypes } from "sequelize";
import db from "../db/connection";

export const Mensaje = db.define("mensaje", {
  id_mensaje: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_remitente: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_receptor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "mensajes",
  timestamps: false,
});


