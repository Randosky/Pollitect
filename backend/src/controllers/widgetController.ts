import { Request, Response } from "express";
import db from "../models";
const { User, Survey } = db;

/** Один ответ внутри сессии */
interface IAnswerItem {
  question_id: number;
  value: string | string[] | boolean;
}

/** Структура одной сессии в responses */
interface ISessionResponse {
  /** Идентификатор сессии */
  sessionId: number;
  /** Флаг завершения сессии */
  isCompleted: boolean;
  /** Имя пользователя */
  name?: string;
  /** Email пользователя */
  email?: string;
  /** Телефон пользователя */
  phone?: string;
  /** Адрес пользователя */
  address?: string;
  /** Ответы пользователя */
  answers: IAnswerItem[];
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
 * POST /api/widget/answer
 * Body JSON:
 *   {
 *     surveyId: number,
 *     sessionId: number,
 *     answer: { question_id: number; value: string|boolean|string[] }
 *   }
 *
 * Обновляет или создаёт запись сессии в responses,
 * при создании новой — увеличивает statistics.incompleteCount
 */
export async function addAnswer(req: Request, res: Response): Promise<void> {
  const { surveyId, sessionId, answer } = req.body as {
    surveyId: number;
    sessionId: number;
    answer: { question_id: number; value: any };
  };

  /** Валидация входных данных */
  if (
    typeof surveyId !== "number" ||
    typeof sessionId !== "number" ||
    !answer ||
    typeof answer.question_id !== "number"
  ) {
    res
      .status(400)
      .json({ message: "Нужны surveyId, sessionId и корректный answer" });
    return;
  }

  try {
    /** Достаём опрос */
    const survey = await Survey.findByPk(surveyId);
    if (!survey) {
      res.status(404).json({ message: "Опрос не найден" });
      return;
    }

    /** Читаем текущие сессии */
    const raw = (survey.get("responses") as ISessionResponse[]) || [];
    const sessions: ISessionResponse[] = Array.isArray(raw) ? raw : [];

    /** Статистика по опросу */
    const stats: any = (survey.get("statistics") as any) || {};
    stats.completedCount = stats.completedCount ?? 0;
    stats.incompleteCount = stats.incompleteCount ?? 0;

    /** Ищем или создаём объект текущей сессии */
    let sess = sessions.find((s) => s.sessionId === sessionId);
    if (!sess) {
      sess = {
        sessionId,
        isCompleted: false,
        answers: [],
      };
      sessions.push(sess);
      stats.incompleteCount += 1;
    }

    /** Обновляем/добавляем ответ внутри этой сессии */
    const idx = sess.answers.findIndex(
      (a) => a.question_id === answer.question_id
    );
    const item: IAnswerItem = {
      question_id: answer.question_id,
      value: answer.value,
    };

    if (idx >= 0) {
      sess.answers[idx] = item;
    } else {
      sess.answers.push(item);
    }

    /** Сохраняем обе колонки: responses и statistics */
    await Survey.update(
      {
        responses: sessions,
        statistics: stats,
      },
      { where: { id: surveyId } }
    );

    /** Отдаём обновлённые данные, чтобы клиент сразу их увидел */
    res.status(200).json({ message: "Ответ сохранён" });
  } catch (err) {
    console.error("addAnswer error:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

/**
 * POST /api/widget/complete
 * Body: { surveyId: number, sessionId: number }
 */
export async function completeSurvey(
  req: Request,
  res: Response
): Promise<void> {
  const { surveyId, sessionId, timer } = req.body as {
    surveyId: number;
    sessionId: number;
    timer: number;
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

    // Получаем все сессии
    const raw = (survey.get("responses") as ISessionResponse[]) || [];
    const sessions: ISessionResponse[] = Array.isArray(raw) ? raw : [];

    // Статистика
    const stats: any = (survey.get("statistics") as any) || {};
    stats.completedCount = stats.completedCount ?? 0;
    stats.incompleteCount = stats.incompleteCount ?? 0;
    stats.averageTimeSec = stats.averageTimeSec ?? 0;

    // Находим сессию, если есть, и обновляем ее, иначе создается новая
    const sess = sessions.find((s) => s.sessionId === sessionId);
    if (sess && !sess.isCompleted) {
      sess.isCompleted = true;
      stats.completedCount += 1;
      stats.incompleteCount = Math.max(0, stats.incompleteCount - 1);

      // Если пришёл валидный таймер — пересчитываем averageTimeSec
      if (typeof timer === "number" && timer > 0) {
        // Исходное время таймера (сек) хранится в display_settings
        const ds: any = survey.get("display_settings");
        const initial = typeof ds.timer_sec === "number" ? ds.timer_sec : 0;

        // Если изначально таймер был включён
        if (initial > 0) {
          // сколько шло прохождение
          const duration = initial - timer;
          // скользящее среднее: (prevAvg * prevCount + duration) / newCount
          const prevCount = stats.completedCount - 1;
          const prevAvg = stats.averageTimeSec;
          const newAvg = Math.round(
            (prevAvg * prevCount + duration) / stats.completedCount
          );

          stats.averageTimeSec = newAvg;
        }
      }
    }

    /** Сохраняем обе колонки: responses и statistics */
    await Survey.update(
      {
        responses: sessions,
        statistics: stats,
      },
      { where: { id: surveyId } }
    );

    res.status(200).json({ message: "Опрос завершён" });
  } catch (err) {
    console.error("completeSurvey error:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

/**
 * POST /api/widget/personal
 * Body JSON:
 *   {
 *     surveyId: number,
 *     sessionId: number,
 *     personal: { name?: string; email?: string; phone?: string; address?: string }
 *   }
 *
 * Сохраняет персональные данные (name, email, phone, address)
 * в объект сессии в поле responses.
 */
export async function savePersonalData(
  req: Request,
  res: Response
): Promise<void> {
  const { surveyId, sessionId, personal } = req.body as {
    surveyId: number;
    sessionId: number;
    personal: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
    };
  };

  // Валидация
  if (
    typeof surveyId !== "number" ||
    typeof sessionId !== "number" ||
    typeof personal !== "object"
  ) {
    res
      .status(400)
      .json({ message: "Нужны surveyId, sessionId и персональные данные" });
    return;
  }

  try {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) {
      res.status(404).json({ message: "Опрос не найден" });
      return;
    }

    // Читаем текущие сессии
    const raw = (survey.get("responses") as ISessionResponse[]) || [];
    const sessions: ISessionResponse[] = Array.isArray(raw) ? raw : [];

    // Статистика (если первый раз создаётся сессия — увеличиваем incompleteCount)
    const stats: any = (survey.get("statistics") as any) || {};
    stats.completedCount = stats.completedCount ?? 0;
    stats.incompleteCount = stats.incompleteCount ?? 0;

    // Ищем или создаём объект текущей сессии
    let sess = sessions.find((s) => s.sessionId === sessionId);
    if (!sess) {
      sess = {
        sessionId,
        isCompleted: false,
        answers: [],
      };
      sessions.push(sess);
      stats.incompleteCount += 1;
    }

    // Функция для безопасного декодирования
    const safeDecode = (v?: string): string | undefined => {
      if (typeof v !== "string") return undefined;
      try {
        return decodeURIComponent(v);
      } catch {
        return v;
      }
    };

    // Сохраняем персональные поля (декодируем)
    const decodedName = safeDecode(personal.name);
    const decodedEmail = safeDecode(personal.email);
    const decodedPhone = safeDecode(personal.phone);
    const decodedAddress = safeDecode(personal.address);

    if (decodedName != null) sess.name = decodedName;
    if (decodedEmail != null) sess.email = decodedEmail;
    if (decodedPhone != null) sess.phone = decodedPhone;
    if (decodedAddress != null) sess.address = decodedAddress;

    // Пишем в базу
    await Survey.update(
      {
        responses: sessions,
        statistics: stats,
      },
      { where: { id: surveyId } }
    );

    res.status(200).json({ message: "Персональные данные сохранены" });
  } catch (err) {
    console.error("savePersonalData error:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}
