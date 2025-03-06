import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import routes from "./routes/routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Мидлвары
app.use(cors());
app.use(express.json());

// 📂 Раздача статических файлов (ПЕРЕД API-роутами)
app.use(express.static(path.join(__dirname, "../public")));

// Роуты API
app.use("/api", routes);

// Корневой маршрут для проверки
app.get("/", (_req: Request, res: Response) => {
  res.send("Сервер работает!");
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
