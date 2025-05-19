import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet, { crossOriginResourcePolicy } from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import surveyRoutes from "./routes/surveyRoutes";
import widgetRoutes from "./routes/widgetRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Общие Мидлвары
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

// API с авторизацией (credentials: true) — только с личного кабинета
const restrictedCors = cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
app.options("/api/auth/*", restrictedCors);
app.use("/api/auth", restrictedCors, authRoutes);
app.options("/api/user/*", restrictedCors);
app.use("/api/user", restrictedCors, userRoutes);
app.options("/api/survey/*", restrictedCors);
app.use("/api/survey", restrictedCors, surveyRoutes);

// Специальный widget-эндпойнт без credentials
app.use("/api/widget", cors({ origin: "*", credentials: false }), widgetRoutes);

// Раздача статических файлов
app.use(
  cors({ origin: "*" }),
  crossOriginResourcePolicy({ policy: "cross-origin" }),
  express.static(path.join(__dirname, "../public"), { index: false })
);

// Корневой маршрут для проверки
app.get("/", (_req: Request, res: Response) => {
  res.send("Сервер работает!");
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
