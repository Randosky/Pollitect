import { Request, Response } from "express";
import db from "../models";
const { User, Survey } = db;

/** Ответ от виджета */
interface TAnswer {
  session_id: number;
  question_id: number;
  value: string | string[] | boolean;
}

/**
 * GET /api/widget
 * Возвращает данные опроса по userId и url
 */
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
 * POST /api/widget/addAnswer
 * Добавляет или обновляет ответ в массиве responses
 * Body JSON:
 *   { surveyId, answer: { session_id, question_id, value } }
 */
export async function addAnswer(req: Request, res: Response): Promise<void> {
  const { surveyId, answer } = req.body as {
    surveyId: number;
    answer: TAnswer;
  };
  if (
    typeof surveyId !== "number" ||
    !answer ||
    typeof answer.session_id !== "number" ||
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

    // Получаем прошлые ответы
    const oldResponses: TAnswer[] =
      (survey.get("responses") as TAnswer[]) || [];

    // Убираем старый ответ этого session_id + question_id
    const filtered = oldResponses.filter(
      (r) =>
        !(
          r.session_id === answer.session_id &&
          r.question_id === answer.question_id
        )
    );

    // Добавляем новый
    const updated = [...filtered, answer];

    await survey.update({ responses: updated });
    res.status(200).json({ message: "Ответ добавлен", responses: updated });
  } catch (err) {
    console.error("addAnswer error:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

/**
 * POST /api/widget/completeSurvey
 * Отмечает завершение опроса для sessionId и обновляет statistics.responsesCount и statistics.completedSessions
 * Body JSON:
 *   { surveyId, sessionId }
 */
export async function completeSurvey(
  req: Request,
  res: Response
): Promise<void> {
  const { surveyId, sessionId } = req.body as {
    surveyId: number;
    sessionId: number;
  };
  if (typeof surveyId !== "number" || typeof sessionId !== "number") {
    res.status(400).json({ message: "Нужны surveyId и sessionId" });
    return;
  }
  try {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) {
      res.status(404).json({ message: "Опрос не найден" });
      return;
    }

    // получаем статистику
    const stats: any = (survey.get("statistics") as any) || {};

    const prevCount =
      typeof stats.responsesCount === "number" ? stats.responsesCount : 0;

    const completed: number[] = Array.isArray(stats.completedSessions)
      ? stats.completedSessions
      : [];

    // если ещё не засчитали эту сессию
    if (!completed.includes(sessionId)) {
      stats.responsesCount = prevCount + 1;
      completed.push(sessionId);
      stats.completedSessions = completed;
    }

    // обновляем только statistics
    await survey.update({ statistics: stats });

    res.status(200).json({ message: "Опрос завершён", statistics: stats });
  } catch (err) {
    console.error("completeSurvey error:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
