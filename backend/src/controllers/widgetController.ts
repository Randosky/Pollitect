import { Request, Response } from "express";
import db from "../models";
const { User, Survey } = db;

interface TAnswer {
  question_id: number;
  value: string | string[] | boolean;
}

export async function getWidget(req: Request, res: Response): Promise<void> {
  const userIdParam = req.query.userId as string;
  const url = req.query.url as string;

  if (!userIdParam || !url) {
    res.status(400).json({ message: "Параметры `userId` и `url` обязательны" });
    return;
  }

  const userId = parseInt(userIdParam, 10);
  if (isNaN(userId)) {
    res.status(400).json({ message: "Неверный `userId`" });
    return;
  }

  try {
    // Ищем пользователя
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    // Берём все активные опросы пользователя
    const surveys = await Survey.findAll({
      where: { user_id: userId, active: true },
      order: [["createdAt", "ASC"]],
    });

    // Фильтруем по URL
    const widget = surveys.find((s) => {
      const ds: any = s.get("display_settings");
      const patterns: string[] = Array.isArray(ds.url_pattern)
        ? ds.url_pattern
        : [];
      const mode: "contains" | "equals" = ds.url_match_mode;

      const normalizeUrl = (inputUrl: string) =>
        inputUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

      const normalizedUrl = normalizeUrl(url);

      return patterns.some((p) => {
        const normalizedPattern = normalizeUrl(p);
        return mode === "equals"
          ? normalizedUrl === normalizedPattern
          : normalizedUrl.includes(normalizedPattern);
      });
    });

    if (!widget) {
      res.status(404).json({ message: "Опрос для этой страницы не найден" });
      return;
    }

    res.status(200).json(widget);
  } catch (error) {
    console.error("getWidget error:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
}

/**
 * Добавляет один ответ в текущий опрос (не трогая статистику).
 * Принимает в body:
 *   - surveyId: number
 *   - answer: { question_id, value }
 */
export async function addAnswer(req: Request, res: Response): Promise<void> {
  const { surveyId, answer } = req.body as {
    surveyId: number;
    answer: TAnswer;
  };

  if (
    typeof surveyId !== "number" ||
    !answer ||
    typeof answer.question_id !== "number"
  ) {
    res.status(400).json({ message: "Нужны surveyId и корректный answer" });
    return;
  }

  try {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) {
      res.status(404).json({ message: "Опрос не найден" });
      return;
    }

    const oldResponses: TAnswer[] =
      (survey.get("responses") as TAnswer[]) || [];
    const updated = [...oldResponses, answer];

    await survey.update({ responses: updated });
    res.status(200).json({ message: "Ответ добавлен", responses: updated });
  } catch (err) {
    console.error("addAnswer error:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

/**
 * Инкрементирует счётчик завершённых прохождений (statistics.responsesCount)
 * и очищает временные ответы.
 * Принимает в body:
 *   - surveyId: number
 */
export async function completeSurvey(
  req: Request,
  res: Response
): Promise<void> {
  const { surveyId } = req.body as { surveyId: number };

  if (typeof surveyId !== "number") {
    res.status(400).json({ message: "Нужен surveyId" });
    return;
  }

  try {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) {
      res.status(404).json({ message: "Опрос не найден" });
      return;
    }

    const stats: any = survey.get("statistics") || {};
    const prevCount =
      typeof stats.responsesCount === "number" ? stats.responsesCount : 0;
    const newStats = { ...stats, responsesCount: prevCount + 1 };

    await survey.update({
      statistics: newStats,
      responses: [], // сброс временных ответов
    });

    res
      .status(200)
      .json({ message: "Статистика обновлена", statistics: newStats });
  } catch (err) {
    console.error("completeSurvey error:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
