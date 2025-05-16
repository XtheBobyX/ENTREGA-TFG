import { DataTypes } from "sequelize";
import db from "../db/connection";

export const Follow = db.define(
  "seguidores",
  {
    id_seguidor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    id_seguido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    }
  },
  {
    tableName: "seguidores",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false, 
  }
);

export default Follow;
