import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Мидлвары
app.use(cors());
app.use(express.json());

// Роуты
app.use('/api', routes);

// Корневая маршрутизация для проверки работы сервера
app.get('/', (_req: Request, res: Response) => {
  res.send('Сервер работает!');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
