import { DataTypes } from "sequelize";
import db from "../db/connection";

export const HashtagPost = db.define(
  "hashtags_posts",
  {
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    id_hashtag: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    }
  },
  {
    tableName: "hashtags_posts",
    timestamps: false,
  }
);

export default HashtagPost;
