import { Router } from "express";
import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/authController";

const router = Router();

// Регистрация нового пользователя
router.post("/register", register);

// Вход пользователя
router.post("/login", login);

// Обновление токена доступа
router.post("/refresh", refresh);

// Выход пользователя
router.post("/logout", logout);

export default router;
