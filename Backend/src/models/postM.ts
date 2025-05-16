import { DataTypes } from "sequelize";
import db from "../db/connection";

export const Post = db.define(
  "Post",
  {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_repost: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "posts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    defaultScope: {
      attributes: { exclude: ["updated_at"] },
    },
  }
);

export default Post;
