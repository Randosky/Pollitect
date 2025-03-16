import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Мидлвары
app.use(cors({ origin: "http://localhost:7124", credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

// 📂 Раздача статических файлов (ПЕРЕД API-роутами)
app.use(express.static(path.join(__dirname, "../public")));

// Роуты API
app.use("/api/auth", authRoutes);

// Корневой маршрут для проверки
app.get("/", (_req: Request, res: Response) => {
  res.send("Сервер работает!");
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
