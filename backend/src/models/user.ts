import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import bcrypt from "bcryptjs";

// Интерфейс полей пользователя
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  refreshToken?: string | null;
}

// Какие поля необязательны при создании (id генерируется автоматически)
export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "phone" | "avatar_url" | "refreshToken"
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare email: string;
  declare password: string;
  declare role: string;
  declare name: string;
  declare phone?: string;
  declare avatar?: string;
  declare refreshToken?: string | null;

  /**
   * Проверка пароля
   *
   * @param password - пароль для проверки
   * @returns {Promise<boolean>} - true, если пароль верный, false - если нет
   */
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  /**
   * Установка ассоциаций модели
   *
   * @param {any} models - объект с моделями
   */
  static associate(models: any) {
    User.hasMany(models.Survey, {
      foreignKey: "user_id",
      as: "surveys",
    });
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
      hooks: {
        /**
         * Перед созданием. Если пароль задан, то хеширует его
         * @param {User} user - экземпляр модели User
         */
        beforeCreate: async (user: User) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        /**
         * Перед обновлением. Если пароль изменился, то хеширует его
         * @param {User} user - экземпляр модели User
         */
        beforeUpdate: async (user: User) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  return User;
};
