// src/routes/settingsRouter.ts
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getUser } from "../controllers/userContorller";

const router = Router();

/**
 * GET /api/user
 * Возвращает данные текущего пользователя
 */
router.get("/", authMiddleware, getUser);

export default router;
