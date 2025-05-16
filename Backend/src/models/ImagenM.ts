import { DataTypes } from "sequelize";
import db from "../db/connection";

export const Multimedia = db.define(
  "Multimedia",
  {
    id_archivo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "posts",
        key: "post_id",
      },
      onDelete: "CASCADE",
      field: "post_id",
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id_usuario",
      },
      onDelete: "CASCADE",
      field: "id_usuario",
    },
    tipo_archivo: {
      type: DataTypes.TEXT("medium"),
    },
    url_archivo: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "Multimedia",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
