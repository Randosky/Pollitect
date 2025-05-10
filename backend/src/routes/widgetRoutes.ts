import express from "express";
import cors from "cors";
import {
  addAnswer,
  completeSurvey,
  getWidget,
  savePersonalData,
} from "../controllers/widgetController";

const router = express.Router();

// Для всех запросов к /api/widget разрешаем любой origin
router.use(cors({ origin: "*", credentials: true }));

/**
 * GET /api/widget
 * Query:
 *  - userId: number
 *  - url: string
 */
router.get("/", getWidget);

/**
 * POST /api/widget/answer
 * Body JSON:
 *   { surveyId: number, answer: { question_id, value } }
 */
router.post("/answer", express.json(), addAnswer);

/**
 * POST /api/widget/complete
 * Body JSON:
 *   { surveyId: number }
 */
router.post("/complete", express.json(), completeSurvey);

/**
 * POST /api/widget/personal
 * Body JSON:
 *   { surveyId: number, sessionId: number, personal: { name, email, phone, address } }
 */
router.post("/personal", express.json(), savePersonalData);

export default router;
