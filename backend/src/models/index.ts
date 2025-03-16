import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";

// Импорт конфигурации Sequelize
// @ts-ignore
import configData from "../../config/config.cjs";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configData[env as keyof typeof configData] as any;

const db: { [key: string]: any } = {};

// Создаем подключение к базе данных
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable] as string, config)
  : new Sequelize(config.database, config.username, config.password, config);

// Динамический импорт моделей
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // исключаем скрытые файлы
      file !== basename && // исключаем сам этот файл index.ts
      file.slice(-3) === ".ts" && // только TypeScript-файлы
      !file.endsWith(".test.ts") // игнорим тестовые файлы
    );
  })
  .forEach((file) => {
    const modelImport = require(path.join(__dirname, file));
    const model = modelImport.default
      ? modelImport.default(sequelize, DataTypes) // Используем default экспорт, если он есть
      : modelImport(sequelize, DataTypes);
    db[model.name] = model;
  });

// Устанавливаем ассоциации моделей
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
