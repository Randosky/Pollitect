import { Model, DataTypes, Sequelize, Optional } from "sequelize";

// Интерфейс для описания структуры данных модели
interface SurveyAttributes {
  id: number;
  title: string;
  description?: string;
}

// Опциональные поля при создании записи (id генерируется автоматически)
interface SurveyCreationAttributes extends Optional<SurveyAttributes, "id"> {}

class Survey extends Model<SurveyAttributes, SurveyCreationAttributes> {
  /**
   * Метод для установления ассоциаций модели
   * с другими моделями
   *
   * @param {any} _models - объект с моделями
   */
  static associate(_models: any) {
    // Здесь можно задать связи с другими моделями
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Survey",
      tableName: "Surveys",
      timestamps: true, // Добавляет createdAt и updatedAt
    }
  );

  return Survey;
};
