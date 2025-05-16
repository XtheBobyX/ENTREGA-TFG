import { DataTypes, Model } from "sequelize";
import db from "../../db/connection";

export class Encuesta extends Model {
  public id_encuesta!: number;  
  public titulo!: Text;
  public post_id!: number;
  public multiple_opciones!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Encuesta.init(
  {
    id_encuesta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "posts",
        key: "post_id",
      },
      onDelete: "CASCADE",
    },
    multiple_opciones: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db, 
    tableName: "encuestas",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
