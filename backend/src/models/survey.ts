import { Model, DataTypes, Sequelize, Optional } from "sequelize";

/** Интерфейс атрибутов Survey */
export interface SurveyAttributes {
  /** Идентификатор опроса */
  id: number;
  /** Идентификатор пользователя */
  user_id: number;
  /** Вопросы */
  questions: object;
  /** Экран приветствия */
  welcomeScreen: object;
  /** Экран сбора персональных данных */
  personalScreen: object;
  /** Экран завершения */
  completionScreen: object;
  /** Настройки дизайна */
  design_settings: object;
  /** Настройки отображения */
  display_settings: object;
  /** Дата создания */
  createdAt?: Date;
  /** Дата обновления */
  updatedAt?: Date;
}

/** Опциональные поля при создании */
export interface SurveyCreationAttributes
  extends Optional<SurveyAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Survey
  extends Model<SurveyAttributes, SurveyCreationAttributes>
  implements SurveyAttributes
{
  public id!: number;
  public user_id!: number;
  public questions!: object;
  public welcomeScreen!: object;
  public personalScreen!: object;
  public completionScreen!: object;
  public design_settings!: object;
  public display_settings!: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Установка ассоциаций модели
   *
   * @param {any} models - объект с моделями
   */
  static associate(models: any) {
    Survey.belongsTo(models.User, { foreignKey: "user_id", as: "author" });
  }
}

export default (sequelize: Sequelize) => {
  Survey.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      questions: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      welcomeScreen: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      personalScreen: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      completionScreen: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      design_settings: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      display_settings: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
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
