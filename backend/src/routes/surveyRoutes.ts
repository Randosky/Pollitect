import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  getAllSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
} from "../controllers/surveyController";

const router = Router();

/**
 * Все маршруты защищены авторизацией: проверяем токен
 */
router.use(authMiddleware);

/**
 * GET /api/surveys
 * @summary Получить список опросов текущего пользователя
 * @returns {Array<Survey>} 200 - список опросов
 */
router.get("/", getAllSurveys);

/**
 * GET /api/surveys/{id}
 * @summary Получить опрос по ID
 * @param {number} id.path.required - ID опроса
 * @returns {Survey} 200 - объект опроса
 */
router.get("/:id", getSurveyById);

/**
 * POST /api/surveys
 * @summary Создать новый опрос
 * @param {ISurvey} request.body.required - Данные опроса без поля user_id
 * @returns {Survey} 201 - созданный опрос
 */
router.post("/", createSurvey);

/**
 * PUT /api/surveys/{id}
 * @summary Обновить существующий опрос
 * @param {number} id.path.required - ID опроса
 * @param {ISurvey} request.body.required - Новые данные опроса
 * @returns {Survey} 200 - обновлённый опрос
 */
router.put("/:id", updateSurvey);

/**
 * DELETE /api/surveys/{id}
 * @summary Удалить опрос
 * @param {number} id.path.required - ID опроса
 * @returns {void} 204 - без содержимого
 */
router.delete("/:id", deleteSurvey);

export default router;
