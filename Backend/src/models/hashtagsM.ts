import { DataTypes } from "sequelize";
import db from "../db/connection";

export const Hashtag = db.define(
  "hashtags",
  {
    id_hashtag: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    hashtag: {
        type: DataTypes.STRING,
    }
  },
  {
    tableName: "hashtags",
    timestamps: false,
  }
);

export default Hashtag;
