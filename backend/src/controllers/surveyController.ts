import { Request, Response } from "express";
import db from "../models";
import { SurveyCreationAttributes } from "../models/survey";

const Survey = db.Survey;

/**
 * Получить список всех опросов текущего пользователя.
 * @async
 * @function getAllSurveys
 * @param {Request} req - Объект запроса Express, должен содержать userId после authMiddleware
 * @param {Response} res - Объект ответа Express
 * @returns {Promise<void>} Возвращает статус 200 и массив опросов или ошибку
 */
export async function getAllSurveys(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.userId!;

  try {
    const surveys = await Survey.findAll({
      where: { user_id: userId },
    });
    res.status(200).json(surveys);
  } catch (error) {
    console.error("getAllSurveys error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Получить один опрос по ID (только текущего пользователя).
 * @async
 * @function getSurveyById
 * @param {Request} req - Объект запроса Express, params.id — идентификатор опроса
 * @param {Response} res - Объект ответа Express
 * @returns {Promise<void>} Возвращает статус 200 и объект опроса или ошибку
 */
export async function getSurveyById(
  req: Request,
  res: Response
): Promise<void> {
  const id = parseInt(req.params.id, 10);
  const userId = req.userId!;

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid survey ID" });

    return;
  }

  try {
    const survey = await Survey.findOne({
      where: { id, user_id: userId },
    });

    if (!survey) {
      res.status(404).json({ message: "Survey not found" });

      return;
    }

    res.status(200).json(survey);
  } catch (error) {
    console.error("getSurveyById error:", error);

    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Создать новый опрос для текущего пользователя.
 * @async
 * @function createSurvey
 * @param {Request} req - Объект запроса Express, body должен соответствовать SurveyCreationAttributes
 * @param {Response} res - Объект ответа Express
 * @returns {Promise<void>} Возвращает статус 201 и созданный объект опроса или ошибку
 */
export async function createSurvey(req: Request, res: Response): Promise<void> {
  const userId = req.userId!;

  try {
    const data = req.body as SurveyCreationAttributes;
    const newSurvey = await Survey.create({ ...data, user_id: userId });

    res.status(201).json(newSurvey);
  } catch (error) {
    console.error("createSurvey error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Обновить опрос по ID (только текущего пользователя).
 * @async
 * @function updateSurvey
 * @param {Request} req - Объект запроса Express, params.id — идентификатор опроса, body — новые данные
 * @param {Response} res - Объект ответа Express
 * @returns {Promise<void>} Возвращает статус 200 и обновлённый объект опроса или ошибку
 */
export async function updateSurvey(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  const userId = req.userId!;

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid survey ID" });

    return;
  }

  try {
    const [updatedCount] = await Survey.update(req.body, {
      where: { id, user_id: userId },
    });

    if (!updatedCount) {
      res.status(404).json({ message: "Survey not found or no permission" });

      return;
    }

    const updatedSurvey = await Survey.findOne({
      where: { id, user_id: userId },
    });

    res.status(200).json(updatedSurvey);
  } catch (error) {
    console.error("updateSurvey error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Удалить опрос по ID (только текущего пользователя).
 * @async
 * @function deleteSurvey
 * @param {Request} req - Объект запроса Express, params.id — идентификатор опроса
 * @param {Response} res - Объект ответа Express
 * @returns {Promise<void>} Возвращает статус 204 при успешном удалении или ошибку
 */
export async function deleteSurvey(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  const userId = req.userId!;

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid survey ID" });

    return;
  }

  try {
    const deletedCount = await Survey.destroy({
      where: { id, user_id: userId },
    });

    if (!deletedCount) {
      res.status(404).json({ message: "Survey not found or no permission" });

      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("deleteSurvey error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
