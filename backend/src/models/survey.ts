import { Model, DataTypes, Sequelize, Optional } from "sequelize";

export interface SurveyAttributes {
  id: number;
  user_id: number;
  title: string;
  active: boolean;
  questions: object[];
  welcomeScreen: object;
  personalScreen: object;
  completionScreen: object;
  design_settings: object;
  display_settings: object;
  responses: object[];
  statistics: object;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SurveyCreationAttributes
  extends Optional<SurveyAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Survey
  extends Model<SurveyAttributes, SurveyCreationAttributes>
  implements SurveyAttributes
{
  declare id: number;
  declare user_id: number;
  declare title: string;
  declare active: boolean;
  declare questions: object[];
  declare welcomeScreen: object;
  declare personalScreen: object;
  declare completionScreen: object;
  declare design_settings: object;
  declare display_settings: object;
  declare responses: object[];
  declare statistics: object;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    Survey.belongsTo(models.User, { foreignKey: "user_id", as: "author" });
  }
}

export default (sequelize: Sequelize) => {
  Survey.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      title: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      questions: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      welcomeScreen: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      personalScreen: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      completionScreen: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      design_settings: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      display_settings: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      responses: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      statistics: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    },
    {
      sequelize,
      modelName: "Survey",
      tableName: "Surveys",
      timestamps: true,
    }
  );
  return Survey;
};
