import { DataTypes } from "sequelize";
import db from "../db/connection";

export const Save = db.define(
  "save_posts",
  {
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    }
  },
  {
    tableName: "save_posts",
    timestamps: false,
  }
);

export default Save;
